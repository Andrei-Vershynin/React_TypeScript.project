import jwt from "jsonwebtoken";
import argon2 from "argon2";
import {
  signRefreshToken,
  hashRefreshToken,
} from "../utils/tokens";
class UnauthorizedError extends Error {
  readonly statusCode = 401;

  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}
import type { UserRepository } from "../domain/post/user/repository";
import type { RefreshSessionRepository } from "../repositories/post.prisma.repository";

const signAccessToken = (userId: string) =>
  jwt.sign({ sub: userId }, process.env.JWT_SECRET!, { expiresIn: "15m" });

export class AuthService {
  private readonly users: UserRepository;
  private readonly sessions: RefreshSessionRepository;

  constructor(
    users: UserRepository,
    sessions: RefreshSessionRepository,
  ) {
    this.users = users;
    this.sessions = sessions;
  }

  async login(email: string, password: string) {
    const user = await this.users.getByEmail(email);
    if (!user || !(await argon2.verify(user.password as unknown as string, password))) {
      throw new UnauthorizedError();
    }
    return this.issueTokens(user.id as unknown as string);
  }

  async refresh(refreshToken: string) {
    let payload: { sub: string };
    try {
      payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!,
      ) as { sub: string };
    } catch {
      throw new UnauthorizedError();
    }

    const consumed = await this.sessions.deleteByHash(hashRefreshToken(refreshToken));
    if (!consumed) throw new UnauthorizedError();

    return this.issueTokens(payload.sub);
  }

  async logout(refreshToken: string | undefined) {
    if (!refreshToken) return;
    await this.sessions.deleteByHash(hashRefreshToken(refreshToken));
  }
  
  private async issueTokens(userId: string) {
    const accessToken = signAccessToken(userId);
    const refreshToken = signRefreshToken(userId);

    const { exp } = jwt.decode(refreshToken) as { exp: number };
    await this.sessions.create({
      userId,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt: new Date(exp * 1000),
    });

    return { accessToken, refreshToken };
  }
}