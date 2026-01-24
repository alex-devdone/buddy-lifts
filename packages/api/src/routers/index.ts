import { protectedProcedure, publicProcedure, router } from "../index";
import { exerciseRouter } from "./exercise";
import { exerciseParserRouter } from "./exercise-parser";
import { friendRouter } from "./friend";
import { progressRouter } from "./progress";
import { sessionRouter } from "./session";
import { todoRouter } from "./todo";
import { trainingRouter } from "./training";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
	privateData: protectedProcedure.query(({ ctx }) => {
		return {
			message: "This is private",
			user: ctx.session.user,
		};
	}),
	todo: todoRouter,
	training: trainingRouter,
	exercise: exerciseRouter,
	exerciseParser: exerciseParserRouter,
	session: sessionRouter,
	progress: progressRouter,
	friend: friendRouter,
});
export type AppRouter = typeof appRouter;
