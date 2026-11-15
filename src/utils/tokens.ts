import { randomUUID, createHash } from "node:crypto";
import jwt from "jsonwebtoken";

export function signRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
    jwtid: randomUUID(),
  });
}

export function hashRefreshToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}