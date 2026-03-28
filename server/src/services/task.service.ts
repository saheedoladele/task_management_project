import type { Task } from "../entities/task.entity.js";
import { TaskRepository } from "../repositories/task.repository.js";
import type { CreateTaskInput, UpdateTaskInput } from "../schemas/task.schema.js";

export class TaskService {
  constructor(private readonly tasks: TaskRepository) {}

  list(userId: string): Promise<Task[]> {
    return this.tasks.findAllForUser(userId);
  }

  getById(userId: string, taskId: string): Promise<Task | null> {
    return this.tasks.findByIdForUser(userId, taskId);
  }

  async create(userId: string, input: CreateTaskInput): Promise<Task> {
    const due = input.due_date ? new Date(input.due_date) : null;
    return this.tasks.createForUser(userId, {
      title: input.title,
      description: input.description,
      due_date: due,
      priority: input.priority,
      status: input.status,
    });
  }

  async update(userId: string, taskId: string, input: UpdateTaskInput): Promise<Task | null> {
    const patch: Partial<
      Pick<Task, "title" | "description" | "due_date" | "priority" | "status">
    > = {};
    if (input.title !== undefined) patch.title = input.title;
    if (input.description !== undefined) patch.description = input.description;
    if (input.priority !== undefined) patch.priority = input.priority;
    if (input.status !== undefined) patch.status = input.status;
    if (input.due_date !== undefined) {
      patch.due_date = input.due_date ? new Date(input.due_date) : null;
    }
    return this.tasks.updateForUser(userId, taskId, patch);
  }

  delete(userId: string, taskId: string): Promise<boolean> {
    return this.tasks.deleteForUser(userId, taskId);
  }
}
