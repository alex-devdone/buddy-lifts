// Supabase Edge Function: notify-complete
// Sends email notification with progress summary when training session is completed

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers":
		"authorization, x-client-info, apikey, content-type",
};

interface SessionCompletePayload {
	old_record: null | Record<string, unknown>;
	record: {
		id: string;
		trainingId: string;
		hostUserId: string;
		inviteCode: string;
		accessType: string;
		status: string;
		startedAt: string | null;
		completedAt: string | null;
	} & Record<string, unknown>;
	type: "UPDATE" | "INSERT";
	table: string;
	schema: string;
}

serve(async (req) => {
	// Handle CORS preflight requests
	if (req.method === "OPTIONS") {
		return new Response("ok", { headers: corsHeaders });
	}

	try {
		// Parse the webhook payload
		const payload: SessionCompletePayload = await req.json();

		// Only handle UPDATE events where status changed to 'completed'
		if (payload.type !== "UPDATE") {
			return new Response(
				JSON.stringify({ message: "Ignoring non-UPDATE event" }),
				{
					status: 200,
					headers: { ...corsHeaders, "Content-Type": "application/json" },
				},
			);
		}

		const { record, old_record } = payload;

		// Check if status changed to 'completed'
		if (old_record?.status === "completed" || record.status !== "completed") {
			return new Response(
				JSON.stringify({ message: "Status not changed to completed" }),
				{
					status: 200,
					headers: { ...corsHeaders, "Content-Type": "application/json" },
				},
			);
		}

		const sessionId = record.id as string;

		// Initialize Supabase client
		const supabaseUrl = Deno.env.get("SUPABASE_URL");
		const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
		if (!supabaseUrl || !supabaseServiceKey) {
			console.error("Missing Supabase environment variables");
			return new Response(
				JSON.stringify({ error: "Supabase environment variables not set" }),
				{
					status: 500,
					headers: { ...corsHeaders, "Content-Type": "application/json" },
				},
			);
		}
		const supabase = createClient(supabaseUrl, supabaseServiceKey);

		// Fetch session details with training info
		const { data: session, error: sessionError } = await supabase
			.from("trainingSession")
			.select(
				`
        id,
        hostUserId,
        startedAt,
        completedAt,
        training:trainings(
          id,
          name,
          description
        )
        `,
			)
			.eq("id", sessionId)
			.single();

		if (sessionError || !session) {
			console.error("Error fetching session:", sessionError);
			return new Response(JSON.stringify({ error: "Session not found" }), {
				status: 404,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			});
		}

		// Fetch all participants with their progress
		const { data: participants, error: participantsError } = await supabase
			.from("sessionParticipant")
			.select(
				`
        userId,
        role,
        joinedAt,
        user:users(
          id,
          name,
          email
        )
        `,
			)
			.eq("sessionId", sessionId);

		if (participantsError || !participants) {
			console.error("Error fetching participants:", participantsError);
			return new Response(JSON.stringify({ error: "Participants not found" }), {
				status: 404,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			});
		}

		// Fetch all exercises for the training
		const { data: exercises, error: exercisesError } = await supabase
			.from("exercise")
			.select("id, name, targetSets, targetReps, order")
			.eq("trainingId", session.training.id)
			.order("order");

		if (exercisesError || !exercises) {
			console.error("Error fetching exercises:", exercisesError);
			return new Response(JSON.stringify({ error: "Exercises not found" }), {
				status: 404,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			});
		}

		// Fetch all progress records for this session
		const { data: progressRecords, error: progressError } = await supabase
			.from("exerciseProgress")
			.select("userId, exerciseId, completedReps, completedAt")
			.eq("sessionId", sessionId);

		if (progressError) {
			console.error("Error fetching progress:", progressError);
		}

		// Calculate completion stats per participant
		const participantStats = participants.map((participant) => {
			const userProgress =
				progressRecords?.filter((p) => p.userId === participant.userId) || [];

			const totalSets = exercises.reduce((sum, ex) => sum + ex.targetSets, 0);
			const completedSets = userProgress.reduce(
				(sum, p) =>
					sum + (Array.isArray(p.completedReps) ? p.completedReps.length : 0),
				0,
			);

			const completionPercentage =
				totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

			return {
				userId: participant.userId,
				name: participant.user.name,
				email: participant.user.email,
				role: participant.role,
				completionPercentage,
				completedSets,
				totalSets,
			};
		});

		// Calculate session duration
		let duration = "";
		if (session.startedAt && session.completedAt) {
			const start = new Date(session.startedAt);
			const end = new Date(session.completedAt);
			const diffMs = end.getTime() - start.getTime();
			const diffMins = Math.round(diffMs / 60000);
			if (diffMins < 60) {
				duration = `${diffMins} minutes`;
			} else {
				const hours = Math.floor(diffMins / 60);
				const mins = diffMins % 60;
				duration = `${hours}h ${mins}m`;
			}
		}

		// Sort participants by completion percentage (highest first)
		const sortedStats = [...participantStats].sort(
			(a, b) => b.completionPercentage - a.completionPercentage,
		);

		// Send emails to all participants
		const emailPromises = participantStats.map(async (stat) => {
			// Find this participant's rank
			const rank = sortedStats.findIndex((s) => s.userId === stat.userId) + 1;
			const rankEmoji =
				rank === 1 ? "🏆" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "👏";

			// Build participant progress HTML
			const participantsHtml = sortedStats
				.map(
					(s) => `
          <tr style="${s.userId === stat.userId ? "background: #f0f9ff;" : ""}">
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
              ${s.userId === stat.userId ? "👤 " : ""}${s.name}
              ${s.role === "host" ? '<span style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 9999px; font-size: 11px; margin-left: 6px;">HOST</span>' : ""}
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
              ${s.completionPercentage}%
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
              ${s.completedSets}/${s.totalSets} sets
            </td>
          </tr>
        `,
				)
				.join("");

			const subject = `Training Complete! ${rankEmoji} You finished #${rank}`;

			// Generate highlights
			const topPerformer = sortedStats[0];
			const isTopPerformer = topPerformer.userId === stat.userId;
			const averageCompletion =
				sortedStats.reduce((sum, s) => sum + s.completionPercentage, 0) /
				sortedStats.length;

			return supabase.auth.admin.sendEmail({
				email: stat.email,
				options: {
					emailRedirectTo: undefined,
					data: {
						subject,
						html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Training Complete</title>
                </head>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Training Complete!</h1>
                    <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Great work team!</p>
                  </div>
                  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
                    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
                      <h2 style="margin: 0 0 10px 0; color: #10b981; font-size: 20px;">
                        ${session.training.name}
                      </h2>
                      ${session.training.description ? `<p style="margin: 0; color: #6b7280; font-size: 14px;">${session.training.description}</p>` : ""}
                    </div>

                    ${
											duration
												? `
                      <div style="text-align: center; margin: 20px 0;">
                        <span style="background: #ecfdf5; color: #059669; padding: 8px 16px; border-radius: 9999px; font-weight: 600;">
                          ⏱️ Duration: ${duration}
                        </span>
                      </div>
                    `
												: ""
										}

                    <div style="margin: 30px 0;">
                      <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">Your Results ${rankEmoji}</h3>
                      <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                          <div>
                            <div style="font-size: 14px; color: #6b7280;">Completion</div>
                            <div style="font-size: 32px; font-weight: 700; color: #10b981;">
                              ${stat.completionPercentage}%
                            </div>
                          </div>
                          <div style="text-align: right;">
                            <div style="font-size: 14px; color: #6b7280;">Rank</div>
                            <div style="font-size: 32px; font-weight: 700; color: #6366f1;">
                              #${rank}
                            </div>
                          </div>
                        </div>
                        <div style="background: #f3f4f6; height: 8px; border-radius: 9999px; overflow: hidden;">
                          <div style="background: linear-gradient(90deg, #10b981, #059669); height: 100%; width: ${stat.completionPercentage}%; transition: width 0.3s;"></div>
                        </div>
                        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                          <div style="font-size: 14px; color: #6b7280;">
                            ${stat.completedSets} of ${stat.totalSets} sets completed
                          </div>
                        </div>
                      </div>
                    </div>

                    ${
											isTopPerformer
												? `
                      <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                        <div style="font-size: 32px; margin-bottom: 10px;">🏆</div>
                        <h3 style="margin: 0 0 5px 0; color: #92400e; font-size: 18px;">Top Performer!</h3>
                        <p style="margin: 0; color: #78350f; font-size: 14px;">You had the highest completion rate!</p>
                      </div>
                    `
												: ""
										}

                    <div style="margin: 30px 0;">
                      <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">Team Results</h3>
                      <div style="background: white; border-radius: 8px; border: 1px solid #e5e7eb; overflow: hidden;">
                        <table style="width: 100%; border-collapse: collapse;">
                          <thead>
                            <tr style="background: #f9fafb;">
                              <th style="padding: 12px; text-align: left; font-size: 13px; color: #6b7280; font-weight: 600;">Participant</th>
                              <th style="padding: 12px; text-align: center; font-size: 13px; color: #6b7280; font-weight: 600;">Progress</th>
                              <th style="padding: 12px; text-align: center; font-size: 13px; color: #6b7280; font-weight: 600;">Sets</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${participantsHtml}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div style="margin: 30px 0; padding: 20px; background: #eff6ff; border-radius: 8px;">
                      <h4 style="margin: 0 0 10px 0; color: #1e40af; font-size: 16px;">Session Highlights</h4>
                      <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #1e3a8a;">
                        <li>${participants.length} participant${participants.length > 1 ? "s" : ""} joined</li>
                        <li>${exercises.length} exercise${exercises.length > 1 ? "s" : ""} completed</li>
                        <li>Average completion: ${Math.round(averageCompletion)}%</li>
                        ${
													sortedStats.length > 1
														? `<li>Close competition: ${Math.abs(sortedStats[0].completionPercentage - sortedStats[1].completionPercentage)}% gap between #1 and #2</li>`
														: ""
												}
                      </ul>
                    </div>

                    <div style="text-align: center; margin-top: 30px;">
                      <a href="${supabaseUrl}/trainings/${session.training.id}"
                         style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                        View Training Details
                      </a>
                    </div>
                  </div>
                  <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
                    <p>Buddy Lifts - Train together, grow together 💪</p>
                  </div>
                </body>
              </html>
            `,
					},
				},
			});
		});

		// Wait for all emails to be sent
		await Promise.allSettled(emailPromises);

		return new Response(
			JSON.stringify({
				message: "Completion notifications sent",
				sessionId,
				participantCount: participants.length,
			}),
			{
				status: 200,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			},
		);
	} catch (error) {
		console.error("Error processing completion notification:", error);
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		});
	}
});
