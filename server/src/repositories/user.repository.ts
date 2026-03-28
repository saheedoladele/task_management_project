import type { Repository } from "typeorm";
import type { User } from "../entities/user.entity.js";

export class UserRepository {
  constructor(private readonly repo: Repository<User>) {}

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email: email.toLowerCase().trim() } });
  }

  findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  create(data: Pick<User, "email" | "passwordHash" | "name">): Promise<User> {
    const entity = this.repo.create({
      email: data.email.toLowerCase().trim(),
      passwordHash: data.passwordHash,
      name: data.name,
    });
    return this.repo.save(entity);
  }

  async updatePasswordHash(id: string, passwordHash: string): Promise<void> {
    await this.repo.update({ id }, { passwordHash });
  }
}
