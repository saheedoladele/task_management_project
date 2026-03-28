import { Router } from "express";
import type { TaskController } from "../controllers/task.controller.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema.js";

export function createTaskRouter(controller: TaskController): Router {
  const router = Router();

  router.get("/", controller.list);
  router.get("/:id", controller.getById);
  router.post("/", validateBody(createTaskSchema), controller.create);
  router.patch("/:id", validateBody(updateTaskSchema), controller.update);
  router.delete("/:id", controller.remove);

  return router;
}
