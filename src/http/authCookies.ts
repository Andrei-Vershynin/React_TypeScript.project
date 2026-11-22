import type { Response } from "express";
import { config } from "../config";
import { AUTH_COOKIE } from "../shared/constants/auth";


const base = { httpOnly: true, sameSite: "lax", secure: config.isProduction } as const;

export function setAuthCookies(res: Response, tokens: { accessToken: string; refreshToken: string }) {
  res.cookie(AUTH_COOKIE.accessToken, tokens.accessToken, { ...base, maxAge: config.jwt.accessTtlSeconds * 1000 });
  res.cookie(AUTH_COOKIE.refreshToken, tokens.refreshToken, { ...base, maxAge: config.jwt.refreshTtlSeconds * 1000 });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie(AUTH_COOKIE.accessToken, base);
  res.clearCookie(AUTH_COOKIE.refreshToken, base);
}