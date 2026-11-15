import type { Request, Response } from "express";
import type { AuthService } from "../../services/auth.service";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export class AuthHandler {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  logout = async (req: Request, res: Response) => {
    await this.authService.logout(req.cookies.refreshToken);

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    res.status(204).send();
  };
}