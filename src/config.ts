function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env variable: ${name}`);
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: required("DATABASE_URL"),
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
  isProduction: process.env.NODE_ENV === "production",
  jwt: {
    accessSecret: required("JWT_ACCESS_SECRET"),
    refreshSecret: required("JWT_REFRESH_SECRET"),
    accessTtlSeconds: 15 * 60,
    refreshTtlSeconds: 7 * 24 * 60 * 60,
  },
} as const;

export type Config = typeof config;