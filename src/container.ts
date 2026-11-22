import { config } from "./config";
import { createDb } from "./infra/db";
import { createPasswordHasher } from "./infra/passwordHasher";
import { createJwt } from "./infra/jwt";
import { createUserRepository, type UserRepository } from "./repositories/user";
import type { JwtPayload } from "jsonwebtoken";
import type { UserService } from "./services/user/user.types";

export function createContainer() {
  const db = createDb(config);
  const passwordHasher = createPasswordHasher();
  const jwt = createJwt(config);

  const userRepository = createUserRepository(db);
  const authService = createAuthService({
      userRepository, passwordHasher, jwt,
      refreshSessionRepository: undefined
  });
  const authHandler = createAuthHandler(authService);
  const requireAuth = createRequireAuth(jwt);
  return { db, authHandler, requireAuth };
}
export type Container = ReturnType<typeof createContainer>;

function createAuthHandler(_authService: UserService) {
    throw new Error("Function not implemented.");
}


function createRequireAuth(_jwt: { signAccess: (userId: number) => string; signRefresh: (userId: number) => string; verifyAccess: (token: string) => JwtPayload; verifyRefresh: (token: string) => JwtPayload; }) {
    throw new Error("Function not implemented.");
}
function createAuthService(_arg0: { userRepository: UserRepository; refreshSessionRepository: any; passwordHasher: { hash: (password: string) => Promise<string>; verify: (hash: string, password: string) => Promise<boolean>; }; jwt: { signAccess: (userId: number) => string; signRefresh: (userId: number) => string; verifyAccess: (token: string) => JwtPayload; verifyRefresh: (token: string) => JwtPayload; }; }): UserService {
    throw new Error("Function not implemented.");
}

