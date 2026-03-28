import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../middlewares/error.middleware.js";
import type { TaskService } from "../services/task.service.js";
import { taskToJson } from "../utils/task-serializer.js";

function requireUserId(req: Request): string {
  const id = req.user?.id;
  if (!id) {
    throw new HttpError(401, "Unauthorized");
  }
  return id;
}

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = requireUserId(req);
      const tasks = await this.taskService.list(userId);
      res.json(tasks.map(taskToJson));
    } catch (e) {
      next(e);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = requireUserId(req);
      const task = await this.taskService.getById(userId, req.params.id);
      if (!task) {
        next(new HttpError(404, "Task not found"));
        return;
      }
      res.json(taskToJson(task));
    } catch (e) {
      next(e);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = requireUserId(req);
      const task = await this.taskService.create(userId, req.body);
      res.status(201).json(taskToJson(task));
    } catch (e) {
      next(e);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = requireUserId(req);
      const task = await this.taskService.update(userId, req.params.id, req.body);
      if (!task) {
        next(new HttpError(404, "Task not found"));
        return;
      }
      res.json(taskToJson(task));
    } catch (e) {
      next(e);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = requireUserId(req);
      const ok = await this.taskService.delete(userId, req.params.id);
      if (!ok) {
        next(new HttpError(404, "Task not found"));
        return;
      }
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  };
}
