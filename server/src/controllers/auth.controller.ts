import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../middlewares/error.middleware.js";
import type { AuthService } from "../services/auth.service.js";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        next(new HttpError(401, "Unauthorized"));
        return;
      }
      await this.authService.changePassword(userId, req.body);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);
      res.json(result);
    } catch (e) {
      next(e);
    }
  };
}
