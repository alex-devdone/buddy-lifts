import { relations } from "drizzle-orm";
import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const training = pgTable(
	"training",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		description: text("description"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("training_userId_idx").on(table.userId)],
);

export const trainingRelations = relations(training, ({ one, many }) => ({
	user: one(user, {
		fields: [training.userId],
		references: [user.id],
	}),
	exercises: many(exercise),
	sessions: many(trainingSession),
}));

export const exercise = pgTable(
	"exercise",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		trainingId: text("training_id")
			.notNull()
			.references(() => training.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		targetSets: integer("target_sets").notNull(),
		targetReps: integer("target_reps").notNull(),
		weight: integer("weight"),
		order: integer("order").notNull(),
		restSeconds: integer("rest_seconds"),
	},
	(table) => [index("exercise_trainingId_idx").on(table.trainingId)],
);

export const exerciseRelations = relations(exercise, ({ one, many }) => ({
	training: one(training, {
		fields: [exercise.trainingId],
		references: [training.id],
	}),
	progress: many(exerciseProgress),
}));

export const trainingSession = pgTable(
	"training_session",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		trainingId: text("training_id")
			.notNull()
			.references(() => training.id, { onDelete: "cascade" }),
		hostUserId: text("host_user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		inviteCode: text("invite_code").notNull().unique(),
		accessType: text("access_type").notNull().$type<"read" | "admin">(),
		status: text("status")
			.notNull()
			.$type<"pending" | "active" | "completed">(),
		startedAt: timestamp("started_at"),
		completedAt: timestamp("completed_at"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("training_session_trainingId_idx").on(table.trainingId),
		index("training_session_hostUserId_idx").on(table.hostUserId),
		index("training_session_inviteCode_idx").on(table.inviteCode),
	],
);

export const trainingSessionRelations = relations(
	trainingSession,
	({ one, many }) => ({
		training: one(training, {
			fields: [trainingSession.trainingId],
			references: [training.id],
		}),
		host: one(user, {
			fields: [trainingSession.hostUserId],
			references: [user.id],
		}),
		participants: many(sessionParticipant),
	}),
);

export const sessionParticipant = pgTable(
	"session_participant",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		sessionId: text("session_id")
			.notNull()
			.references(() => trainingSession.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		role: text("role").notNull().$type<"host" | "admin" | "read">(),
		joinedAt: timestamp("joined_at").defaultNow().notNull(),
	},
	(table) => [
		index("session_participant_sessionId_idx").on(table.sessionId),
		index("session_participant_userId_idx").on(table.userId),
	],
);

export const sessionParticipantRelations = relations(
	sessionParticipant,
	({ one, many }) => ({
		session: one(trainingSession, {
			fields: [sessionParticipant.sessionId],
			references: [trainingSession.id],
		}),
		user: one(user, {
			fields: [sessionParticipant.userId],
			references: [user.id],
		}),
		progress: many(exerciseProgress),
	}),
);

export const exerciseProgress = pgTable(
	"exercise_progress",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		sessionId: text("session_id")
			.notNull()
			.references(() => trainingSession.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		exerciseId: text("exercise_id")
			.notNull()
			.references(() => exercise.id, { onDelete: "cascade" }),
		completedReps: text("completed_reps").notNull().$type<string>(), // JSON array stored as string
		completedAt: timestamp("completed_at"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("exercise_progress_sessionId_idx").on(table.sessionId),
		index("exercise_progress_userId_idx").on(table.userId),
		index("exercise_progress_exerciseId_idx").on(table.exerciseId),
	],
);

export const exerciseProgressRelations = relations(
	exerciseProgress,
	({ one }) => ({
		session: one(trainingSession, {
			fields: [exerciseProgress.sessionId],
			references: [trainingSession.id],
		}),
		user: one(user, {
			fields: [exerciseProgress.userId],
			references: [user.id],
		}),
		exercise: one(exercise, {
			fields: [exerciseProgress.exerciseId],
			references: [exercise.id],
		}),
	}),
);

export const friend = pgTable(
	"friend",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		friendId: text("friend_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		status: text("status")
			.notNull()
			.$type<"pending" | "accepted" | "blocked">(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("friend_userId_idx").on(table.userId),
		index("friend_friendId_idx").on(table.friendId),
	],
);

export const friendRelations = relations(friend, ({ one }) => ({
	user: one(user, {
		fields: [friend.userId],
		references: [user.id],
	}),
	friend: one(user, {
		fields: [friend.friendId],
		references: [user.id],
	}),
}));
