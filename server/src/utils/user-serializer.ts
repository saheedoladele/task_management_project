import type { User } from "../entities/user.entity.js";

export function userToPublic(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    created_at: user.created_at.toISOString(),
  };
}
