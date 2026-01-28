import { generateInviteCode, isValidInviteCode } from "../../utils/invite-code";

class ServiceError extends Error {
	code: string;

	constructor(code: string, message: string) {
		super(message);
		this.code = code;
	}
}

type AccessType = "read" | "admin";
type SessionStatus = "active" | "completed";

interface Training {
	id: string;
	userId: string;
}

interface TrainingSession {
	id: string;
	trainingId: string;
	hostUserId: string;
	inviteCode: string;
	accessType: AccessType;
	status: SessionStatus;
	startedAt: Date;
	completedAt?: Date;
}

interface SessionParticipant {
	id: string;
	sessionId: string;
	userId: string;
	role: "host" | "admin" | "read";
}

interface ExerciseProgress {
	id: string;
	sessionId: string;
	userId: string;
	exerciseId: string;
}

interface SessionStore {
	trainings: Map<string, Training>;
	sessions: Map<string, TrainingSession>;
	participants: SessionParticipant[];
	progress: ExerciseProgress[];
}

const createStore = (): SessionStore => ({
	trainings: new Map(),
	sessions: new Map(),
	participants: [],
	progress: [],
});

const createSessionService = (store: SessionStore) => {
	let sessionCounter = 0;
	let participantCounter = 0;
	let progressCounter = 0;

	const findActiveSession = (trainingId: string) =>
		[...store.sessions.values()].find(
			(session) =>
				session.trainingId === trainingId && session.status === "active",
		);

	const findSessionByInvite = (inviteCode: string) =>
		[...store.sessions.values()].find(
			(session) => session.inviteCode === inviteCode,
		);

	const findParticipant = (sessionId: string, userId: string) =>
		store.participants.find(
			(participant) =>
				participant.sessionId === sessionId && participant.userId === userId,
		);

	return {
		createTraining: (training: Training) => {
			store.trainings.set(training.id, training);
		},
		addProgress: (sessionId: string, userId: string) => {
			progressCounter += 1;
			store.progress.push({
				id: `progress-${progressCounter}`,
				sessionId,
				userId,
				exerciseId: `exercise-${progressCounter}`,
			});
		},
		start: ({
			trainingId,
			accessType,
			userId,
		}: {
			trainingId: string;
			accessType: AccessType;
			userId: string;
		}) => {
			const training = store.trainings.get(trainingId);
			if (!training) {
				throw new ServiceError("NOT_FOUND", "Training not found");
			}
			if (training.userId !== userId) {
				throw new ServiceError(
					"FORBIDDEN",
					"You can only start sessions for your own trainings",
				);
			}
			if (findActiveSession(trainingId)) {
				throw new ServiceError(
					"CONFLICT",
					"An active session already exists for this training",
				);
			}

			let inviteCode = generateInviteCode();
			while (findSessionByInvite(inviteCode)) {
				inviteCode = generateInviteCode();
			}

			sessionCounter += 1;
			const session: TrainingSession = {
				id: `session-${sessionCounter}`,
				trainingId,
				hostUserId: userId,
				inviteCode,
				accessType,
				status: "active",
				startedAt: new Date(),
			};
			store.sessions.set(session.id, session);

			participantCounter += 1;
			store.participants.push({
				id: `participant-${participantCounter}`,
				sessionId: session.id,
				userId,
				role: "host",
			});

			return session;
		},
		join: ({
			inviteCode,
			userId,
			accessType,
		}: {
			inviteCode: string;
			userId: string;
			accessType?: AccessType;
		}) => {
			if (!isValidInviteCode(inviteCode)) {
				throw new ServiceError("BAD_REQUEST", "Invalid invite code format");
			}
			const session = findSessionByInvite(inviteCode);
			if (!session) {
				throw new ServiceError("NOT_FOUND", "Invalid invite code");
			}
			if (session.status !== "active") {
				throw new ServiceError("CONFLICT", "This session is not active");
			}
			if (findParticipant(session.id, userId)) {
				throw new ServiceError(
					"CONFLICT",
					"You have already joined this session",
				);
			}

			participantCounter += 1;
			const requestedAccessType = accessType ?? session.accessType;
			const role = requestedAccessType === "admin" ? "admin" : "read";
			store.participants.push({
				id: `participant-${participantCounter}`,
				sessionId: session.id,
				userId,
				role,
			});

			return { sessionId: session.id, trainingId: session.trainingId, role };
		},
		leave: ({ sessionId, userId }: { sessionId: string; userId: string }) => {
			const session = store.sessions.get(sessionId);
			if (!session) {
				throw new ServiceError("NOT_FOUND", "Session not found");
			}
			if (session.hostUserId === userId) {
				throw new ServiceError(
					"FORBIDDEN",
					"Host cannot leave. Use the end session action instead.",
				);
			}
			const participantIndex = store.participants.findIndex(
				(participant) =>
					participant.sessionId === sessionId && participant.userId === userId,
			);
			if (participantIndex === -1) {
				throw new ServiceError(
					"NOT_FOUND",
					"You are not a participant in this session",
				);
			}

			store.participants.splice(participantIndex, 1);
			store.progress = store.progress.filter(
				(entry) => !(entry.sessionId === sessionId && entry.userId === userId),
			);

			return { success: true };
		},
		end: ({ sessionId, userId }: { sessionId: string; userId: string }) => {
			const session = store.sessions.get(sessionId);
			if (!session) {
				throw new ServiceError("NOT_FOUND", "Session not found");
			}
			if (session.hostUserId !== userId) {
				throw new ServiceError(
					"FORBIDDEN",
					"Only the host can end the session",
				);
			}
			if (session.status === "completed") {
				throw new ServiceError("CONFLICT", "Session is already completed");
			}

			session.status = "completed";
			session.completedAt = new Date();
			store.sessions.set(session.id, session);
			return session;
		},
		updateAccess: ({
			sessionId,
			userId,
			accessType,
		}: {
			sessionId: string;
			userId: string;
			accessType: AccessType;
		}) => {
			const session = store.sessions.get(sessionId);
			if (!session) {
				throw new ServiceError("NOT_FOUND", "Session not found");
			}
			if (session.hostUserId !== userId) {
				throw new ServiceError(
					"FORBIDDEN",
					"Only the host can change access type",
				);
			}
			session.accessType = accessType;
			store.sessions.set(session.id, session);
			return session;
		},
	};
};

describe("Session Router - Integration Flow", () => {
	describe("start -> join -> leave -> end", () => {
		test("start creates an active session and registers host", () => {
			const store = createStore();
			const service = createSessionService(store);
			service.createTraining({ id: "training-1", userId: "user-host" });

			const session = service.start({
				trainingId: "training-1",
				accessType: "read",
				userId: "user-host",
			});

			expect(session.status).toBe("active");
			expect(isValidInviteCode(session.inviteCode)).toBe(true);
			expect(
				store.participants.some(
					(participant) =>
						participant.sessionId === session.id &&
						participant.userId === "user-host" &&
						participant.role === "host",
				),
			).toBe(true);
		});

		test("start prevents multiple active sessions for the same training", () => {
			const store = createStore();
			const service = createSessionService(store);
			service.createTraining({ id: "training-1", userId: "user-host" });

			service.start({
				trainingId: "training-1",
				accessType: "read",
				userId: "user-host",
			});

			expect(() =>
				service.start({
					trainingId: "training-1",
					accessType: "admin",
					userId: "user-host",
				}),
			).toThrow("An active session already exists for this training");
		});

		test("join adds participant with role based on access type", () => {
			const accessTypes: AccessType[] = ["read", "admin"];

			for (const accessType of accessTypes) {
				const store = createStore();
				const service = createSessionService(store);
				service.createTraining({ id: "training-1", userId: "user-host" });

				const session = service.start({
					trainingId: "training-1",
					accessType,
					userId: "user-host",
				});

				const result = service.join({
					inviteCode: session.inviteCode,
					userId: "user-joiner",
				});

				expect(result.role).toBe(accessType === "admin" ? "admin" : "read");
				expect(
					store.participants.some(
						(participant) =>
							participant.sessionId === session.id &&
							participant.userId === "user-joiner",
					),
				).toBe(true);
			}
		});

		test("join honors explicit access type override", () => {
			const store = createStore();
			const service = createSessionService(store);
			service.createTraining({ id: "training-1", userId: "user-host" });

			const session = service.start({
				trainingId: "training-1",
				accessType: "read",
				userId: "user-host",
			});

			const result = service.join({
				inviteCode: session.inviteCode,
				userId: "user-joiner",
				accessType: "admin",
			});

			expect(result.role).toBe("admin");
		});

		test("join blocks duplicate participants", () => {
			const store = createStore();
			const service = createSessionService(store);
			service.createTraining({ id: "training-1", userId: "user-host" });

			const session = service.start({
				trainingId: "training-1",
				accessType: "read",
				userId: "user-host",
			});

			service.join({ inviteCode: session.inviteCode, userId: "user-joiner" });

			expect(() =>
				service.join({
					inviteCode: session.inviteCode,
					userId: "user-joiner",
				}),
			).toThrow("You have already joined this session");
		});

		test("leave removes participant and progress records", () => {
			const store = createStore();
			const service = createSessionService(store);
			service.createTraining({ id: "training-1", userId: "user-host" });

			const session = service.start({
				trainingId: "training-1",
				accessType: "read",
				userId: "user-host",
			});

			service.join({ inviteCode: session.inviteCode, userId: "user-joiner" });
			service.addProgress(session.id, "user-joiner");
			service.addProgress(session.id, "user-host");

			const result = service.leave({
				sessionId: session.id,
				userId: "user-joiner",
			});

			expect(result.success).toBe(true);
			expect(
				store.participants.some(
					(participant) =>
						participant.sessionId === session.id &&
						participant.userId === "user-joiner",
				),
			).toBe(false);
			expect(
				store.progress.some((entry) => entry.userId === "user-joiner"),
			).toBe(false);
			expect(store.progress.some((entry) => entry.userId === "user-host")).toBe(
				true,
			);
		});

		test("end completes session when invoked by host", () => {
			const store = createStore();
			const service = createSessionService(store);
			service.createTraining({ id: "training-1", userId: "user-host" });

			const session = service.start({
				trainingId: "training-1",
				accessType: "read",
				userId: "user-host",
			});

			const ended = service.end({ sessionId: session.id, userId: "user-host" });

			expect(ended.status).toBe("completed");
			expect(ended.completedAt).toBeInstanceOf(Date);
		});

		test("updateAccess changes access type for future participants", () => {
			const store = createStore();
			const service = createSessionService(store);
			service.createTraining({ id: "training-1", userId: "user-host" });

			const session = service.start({
				trainingId: "training-1",
				accessType: "read",
				userId: "user-host",
			});

			const updated = service.updateAccess({
				sessionId: session.id,
				userId: "user-host",
				accessType: "admin",
			});

			expect(updated.accessType).toBe("admin");

			const joinResult = service.join({
				inviteCode: session.inviteCode,
				userId: "user-joiner",
			});

			expect(joinResult.role).toBe("admin");
		});

		test("join blocks when the session is completed", () => {
			const store = createStore();
			const service = createSessionService(store);
			service.createTraining({ id: "training-1", userId: "user-host" });

			const session = service.start({
				trainingId: "training-1",
				accessType: "read",
				userId: "user-host",
			});

			service.end({ sessionId: session.id, userId: "user-host" });

			expect(() =>
				service.join({ inviteCode: session.inviteCode, userId: "user-joiner" }),
			).toThrow("This session is not active");
		});
	});

	describe("access control", () => {
		test("start rejects non-owners", () => {
			const store = createStore();
			const service = createSessionService(store);
			service.createTraining({ id: "training-1", userId: "user-host" });

			expect(() =>
				service.start({
					trainingId: "training-1",
					accessType: "read",
					userId: "user-other",
				}),
			).toThrow("You can only start sessions for your own trainings");
		});

		test("end rejects non-hosts", () => {
			const store = createStore();
			const service = createSessionService(store);
			service.createTraining({ id: "training-1", userId: "user-host" });

			const session = service.start({
				trainingId: "training-1",
				accessType: "read",
				userId: "user-host",
			});

			expect(() =>
				service.end({ sessionId: session.id, userId: "user-joiner" }),
			).toThrow("Only the host can end the session");
		});

		test("updateAccess rejects non-hosts", () => {
			const store = createStore();
			const service = createSessionService(store);
			service.createTraining({ id: "training-1", userId: "user-host" });

			const session = service.start({
				trainingId: "training-1",
				accessType: "read",
				userId: "user-host",
			});

			expect(() =>
				service.updateAccess({
					sessionId: session.id,
					userId: "user-joiner",
					accessType: "admin",
				}),
			).toThrow("Only the host can change access type");
		});

		test("leave rejects host participants", () => {
			const store = createStore();
			const service = createSessionService(store);
			service.createTraining({ id: "training-1", userId: "user-host" });

			const session = service.start({
				trainingId: "training-1",
				accessType: "read",
				userId: "user-host",
			});

			expect(() =>
				service.leave({ sessionId: session.id, userId: "user-host" }),
			).toThrow("Host cannot leave. Use the end session action instead.");
		});
	});

	describe("input validation", () => {
		test("join requires a valid invite code format", () => {
			const store = createStore();
			const service = createSessionService(store);

			expect(() =>
				service.join({ inviteCode: "invalid", userId: "user-joiner" }),
			).toThrow("Invalid invite code format");
		});
	});
});
