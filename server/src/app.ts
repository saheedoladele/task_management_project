import cors from "cors";
import type { RequestHandler } from "express";
import express from "express";
import AppDataSource from "./config/data-source.js";
import { env } from "./config/env.js";
import type { AuthController } from "./controllers/auth.controller.js";
import type { TaskController } from "./controllers/task.controller.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { createApiRouter } from "./routes/index.js";

export function createApp(deps: {
  authController: AuthController;
  taskController: TaskController;
  requireAuth: RequestHandler;
}) {
  const app = express();

  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
    }),
  );
  app.use(express.json(httpJsonOptions()));

  app.get("/health", (_req, res) => {
    const dbConnected = AppDataSource.isInitialized;
    res.json({
      ok: true,
      service: "task-manager-api",
      database: dbConnected ? "connected" : "disconnected",
      uptime: process.uptime(),
    });
  });

  app.use(
    "/api",
    createApiRouter({
      authController: deps.authController,
      taskController: deps.taskController,
      requireAuth: deps.requireAuth,
    }),
  );

  app.use(errorMiddleware);

  return app;
}

/** Slightly higher default to tolerate larger payloads if descriptions grow. */
function httpJsonOptions() {
  return { limit: "1mb" as const };
}
