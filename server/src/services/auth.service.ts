import bcrypt from "bcrypt";
import { HttpError } from "../middlewares/error.middleware.js";
import { UserRepository } from "../repositories/user.repository.js";
import type { ChangePasswordInput, LoginInput, RegisterInput } from "../schemas/auth.schema.js";
import { signAccessToken } from "../utils/jwt.js";
import { userToPublic } from "../utils/user-serializer.js";

const SALT_ROUNDS = 10;

export class AuthService {
  constructor(private readonly users: UserRepository) {}

  async register(input: RegisterInput) {
    const existing = await this.users.findByEmail(input.email);
    if (existing) {
      throw new HttpError(409, "Email already registered");
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
    const user = await this.users.create({
      email: input.email,
      passwordHash,
      name: input.name?.trim() || null,
    });

    const token = signAccessToken(user.id, user.email);
    return { token, user: userToPublic(user) };
  }

  async login(input: LoginInput) {
    const user = await this.users.findByEmail(input.email);
    if (!user) {
      throw new HttpError(401, "Invalid email or password");
    }

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) {
      throw new HttpError(401, "Invalid email or password");
    }

    const token = signAccessToken(user.id, user.email);
    return { token, user: userToPublic(user) };
  }

  async changePassword(userId: string, input: ChangePasswordInput) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new HttpError(401, "User not found");
    }

    const ok = await bcrypt.compare(input.currentPassword, user.passwordHash);
    if (!ok) {
      throw new HttpError(401, "Current password is incorrect");
    }

    const passwordHash = await bcrypt.hash(input.newPassword, SALT_ROUNDS);
    await this.users.updatePasswordHash(userId, passwordHash);
  }
}
