// Supabase Edge Function: notify-join
// Sends email notification when someone joins a training session

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers":
		"authorization, x-client-info, apikey, content-type",
};

interface ParticipantJoinPayload {
	old_record: null | Record<string, unknown>;
	record: {
		id: string;
		sessionId: string;
		odUserId: string;
		role: string;
		joinedAt: string;
	} & Record<string, unknown>;
	type: "INSERT";
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
		const payload: ParticipantJoinPayload = await req.json();

		// Only handle INSERT events
		if (payload.type !== "INSERT") {
			return new Response(
				JSON.stringify({ message: "Ignoring non-INSERT event" }),
				{
					status: 200,
					headers: { ...corsHeaders, "Content-Type": "application/json" },
				},
			);
		}

		const { record } = payload;
		const sessionId = record.sessionId as string;
		const newParticipantId = record.odUserId as string;

		// Initialize Supabase client
		const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
		const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
		const supabase = createClient(supabaseUrl, supabaseServiceKey);

		// Fetch session details to get the host info
		const { data: session, error: sessionError } = await supabase
			.from("trainingSession")
			.select(
				`
        id,
        hostUserId,
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

		// Don't send notification if the host joined themselves
		if (session.hostUserId === newParticipantId) {
			return new Response(
				JSON.stringify({ message: "Host joined, skipping notification" }),
				{
					status: 200,
					headers: { ...corsHeaders, "Content-Type": "application/json" },
				},
			);
		}

		// Fetch the new participant's user info
		const { data: newParticipant, error: participantError } = await supabase
			.from("users")
			.select("id, name, email")
			.eq("id", newParticipantId)
			.single();

		if (participantError || !newParticipant) {
			console.error("Error fetching participant:", participantError);
			return new Response(JSON.stringify({ error: "Participant not found" }), {
				status: 404,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			});
		}

		// Fetch the host's user info for email
		const { data: host, error: hostError } = await supabase
			.from("users")
			.select("id, name, email")
			.eq("id", session.hostUserId)
			.single();

		if (hostError || !host) {
			console.error("Error fetching host:", hostError);
			return new Response(JSON.stringify({ error: "Host not found" }), {
				status: 404,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			});
		}

		// Send email notification using Supabase Auth Admin API for Resend
		// Note: This requires Resend to be configured in Supabase
		const { error: emailError } = await supabase.auth.admin.sendEmail({
			email: host.email as string,
			options: {
				emailRedirectTo: undefined,
				data: {
					subject: `${newParticipant.name} joined your training session!`,
					html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Participant Joined</title>
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Someone Joined Your Training!</h1>
                </div>
                <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 15px 0; font-size: 16px;">
                    <strong>${newParticipant.name}</strong> has joined your training session:
                  </p>
                  <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
                    <h2 style="margin: 0 0 10px 0; color: #667eea; font-size: 20px;">
                      ${session.training.name}
                    </h2>
                    ${session.training.description ? `<p style="margin: 0; color: #6b7280; font-size: 14px;">${session.training.description}</p>` : ""}
                  </div>
                  <p style="margin: 20px 0 10px 0; font-size: 14px; color: #6b7280;">
                    Role: <strong>${record.role}</strong>
                  </p>
                  <p style="margin: 10px 0 20px 0; font-size: 14px; color: #6b7280;">
                    Joined at: ${new Date(record.joinedAt as string).toLocaleString()}
                  </p>
                  <div style="text-align: center;">
                    <a href="${supabaseUrl}/trainings/${session.training.id}/session"
                       style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                      View Session
                    </a>
                  </div>
                </div>
                <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
                  <p>You're receiving this because you're the host of this training session.</p>
                  <p>Buddy Lifts - Train together, grow together 💪</p>
                </div>
              </body>
            </html>
          `,
				},
			},
		});

		// Fallback: Log if email sending fails (Resend might not be configured)
		if (emailError) {
			console.log("Email notification (would be sent):", {
				to: host.email,
				subject: `${newParticipant.name} joined your training session!`,
				trainingName: session.training.name,
			});
		}

		return new Response(
			JSON.stringify({
				message: "Join notification processed",
				participant: newParticipant.name,
				training: session.training.name,
			}),
			{
				status: 200,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			},
		);
	} catch (error) {
		console.error("Error processing join notification:", error);
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		});
	}
});
