import { PrismaClient } from "@prisma/client/extension";
import type { Config } from "../config";

export function createDb(_config: Config) {
  return new PrismaClient({  });
}
export type Db = ReturnType<typeof createDb>;