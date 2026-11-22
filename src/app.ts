import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "./config";
import type { Container } from "./container";

const ROUTES = {
  auth: { base: "/auth" },
  posts: "/posts",
  categories: "/categories",
} as const;

export function createApp(container: Container) {
  const app = express();
  app.use(cors({ origin: config.clientOrigin, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.use(ROUTES.auth.base, createAuthRouter(container));
  app.use(ROUTES.posts, createAuthRouter(container));
  app.use(ROUTES.categories, createAuthRouter(container));
  return app;
}

function createAuthRouter(_container: { db: any; authHandler: void; requireAuth: void; }): import("express-serve-static-core").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> {
    throw new Error("Function not implemented.");
}
