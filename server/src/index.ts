import "reflect-metadata";
import type { DataSource } from "typeorm";
import AppDataSource from "./config/data-source.js";
import { env } from "./config/env.js";
import { createApp } from "./app.js";
import { Task } from "./entities/task.entity.js";
import { User } from "./entities/user.entity.js";
import { AuthController } from "./controllers/auth.controller.js";
import { TaskController } from "./controllers/task.controller.js";
import { requireAuth } from "./middlewares/auth.middleware.js";
import { TaskRepository } from "./repositories/task.repository.js";
import { UserRepository } from "./repositories/user.repository.js";
import { AuthService } from "./services/auth.service.js";
import { TaskService } from "./services/task.service.js";

function logDatabaseConnected(ds: DataSource) {
  const opt = ds.options as {
    url?: string;
    database?: string;
    host?: string;
    port?: number;
  };
  if (opt.url) {
    try {
      const u = new URL(opt.url);
      const dbName = u.pathname.replace(/^\//, "") || "(default)";
      console.log(
        `[database] status: connected → ${u.hostname}:${u.port || "5432"}/${dbName}`,
      );
    } catch {
      console.log("[database] status: connected (DATABASE_URL)");
    }
    return;
  }
  console.log(
    `[database] status: connected → ${opt.host ?? "localhost"}:${String(opt.port ?? 5432)}/${String(opt.database ?? "")}`,
  );
}

async function bootstrap() {
  if (env.nodeEnv === "production" && env.jwt.secret === "dev-only-change-me") {
    console.error("Set JWT_SECRET in production.");
    process.exit(1);
  }

  try {
    await AppDataSource.initialize();
    logDatabaseConnected(AppDataSource);
  } catch (err) {
    console.error("[database] status: failed");
    console.error(
      "        hint: verify DATABASE_URL or DB_* and that PostgreSQL is reachable.",
    );
    console.error(err);
    process.exit(1);
  }

  const userRepository = new UserRepository(AppDataSource.getRepository(User));
  const taskRepository = new TaskRepository(AppDataSource.getRepository(Task));

  const authService = new AuthService(userRepository);
  const authController = new AuthController(authService);

  const taskService = new TaskService(taskRepository);
  const taskController = new TaskController(taskService);

  const app = createApp({
    authController,
    taskController,
    requireAuth,
  });

  app.listen(env.port, () => {
    const base = `http://localhost:${env.port}`;
    console.log(`[api] status: listening on ${base}`);
    console.log(`[api] health: GET ${base}/health (returns ok + database + uptime)`);
  });
}

bootstrap().catch((err) => {
  console.error("[bootstrap] failed:", err);
  process.exit(1);
});
