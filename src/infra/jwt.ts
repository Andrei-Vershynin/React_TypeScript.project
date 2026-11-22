import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import type { Config } from "../config";

export function createJwt(config: Config) {
  return {
    signAccess: (userId: number) =>
      jwt.sign({ sub: String(userId) }, config.jwt.accessSecret, { expiresIn: config.jwt.accessTtlSeconds }),
    signRefresh: (userId: number) =>
      jwt.sign({ sub: String(userId) }, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshTtlSeconds,
        jwtid: randomUUID(),
      }),
    verifyAccess: (token: string) => jwt.verify(token, config.jwt.accessSecret) as jwt.JwtPayload,
    verifyRefresh: (token: string) => jwt.verify(token, config.jwt.refreshSecret) as jwt.JwtPayload,
  };
}
export type JwtService = ReturnType<typeof createJwt>;