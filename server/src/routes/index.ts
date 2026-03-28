import type { RequestHandler } from "express";
import { Router } from "express";
import type { AuthController } from "../controllers/auth.controller.js";
import type { TaskController } from "../controllers/task.controller.js";
import { createAuthRouter } from "./auth.routes.js";
import { createTaskRouter } from "./task.routes.js";

export function createApiRouter(deps: {
  authController: AuthController;
  taskController: TaskController;
  requireAuth: RequestHandler;
}): Router {
  const router = Router();

  router.use("/auth", createAuthRouter(deps.authController, deps.requireAuth));
  router.use("/tasks", deps.requireAuth, createTaskRouter(deps.taskController));

  return router;
}
