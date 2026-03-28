import type { Repository } from "typeorm";
import type { Task } from "../entities/task.entity.js";

/**
 * Data access only — no HTTP or business rules beyond query shape.
 * All queries are scoped to `userId`.
 */
export class TaskRepository {
  constructor(private readonly repo: Repository<Task>) {}

  findAllForUser(userId: string): Promise<Task[]> {
    return this.repo.find({
      where: { user: { id: userId } },
      order: { created_at: "DESC" },
    });
  }

  findByIdForUser(userId: string, taskId: string): Promise<Task | null> {
    return this.repo.findOne({
      where: { id: taskId, user: { id: userId } },
    });
  }

  createForUser(
    userId: string,
    data: Omit<Task, "id" | "created_at" | "updated_at" | "user">,
  ): Promise<Task> {
    const entity = this.repo.create({
      ...data,
      user: { id: userId },
    });
    return this.repo.save(entity);
  }

  async updateForUser(
    userId: string,
    taskId: string,
    patch: Partial<Omit<Task, "id" | "user" | "created_at" | "updated_at">>,
  ): Promise<Task | null> {
    const existing = await this.findByIdForUser(userId, taskId);
    if (!existing) return null;
    Object.assign(existing, patch);
    return this.repo.save(existing);
  }

  async deleteForUser(userId: string, taskId: string): Promise<boolean> {
    const existing = await this.findByIdForUser(userId, taskId);
    if (!existing) return false;
    await this.repo.remove(existing);
    return true;
  }
}
