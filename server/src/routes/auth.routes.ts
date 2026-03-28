import type { RequestHandler } from "express";
import { Router } from "express";
import type { AuthController } from "../controllers/auth.controller.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { changePasswordSchema, loginSchema, registerSchema } from "../schemas/auth.schema.js";

export function createAuthRouter(controller: AuthController, requireAuth: RequestHandler): Router {
  const router = Router();

  router.post("/register", validateBody(registerSchema), controller.register);
  router.post("/login", validateBody(loginSchema), controller.login);
  router.post(
    "/change-password",
    requireAuth,
    validateBody(changePasswordSchema),
    controller.changePassword,
  );

  return router;
}
