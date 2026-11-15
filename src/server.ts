import express from "express"
const { PrismaClient } = require("@prisma/client")
import { createProductRouter } from "./transport/routers/products.ts"
import { createProductService } from "./services/products/products.js"
import { createProductHandler } from "./transport/handlers/product/product.js"
import { createCategoryRepository, createProductRepository } from "./repositories/post.prisma.repository.ts"
import * as categoryServiceModule from "./services/category/category.js"
import { createCategoryHandlers } from "./transport/handlers/category/category.js"
import { createCategoryRouter } from "./transport/routers/category.js"
import { createUserRepository } from "./repositories/user.js"
import * as userServiceModule from "./services/user/user.js"
import { createUserHandler } from "./transport/handlers/user/user.js"
import { hashPassword, verifyPassword } from "./lib/password.js"
import { createUserRouter } from "./transport/routers/auth.js"
import { hashRefreshToken, signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from "./lib/jwt.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import { createRequireAuth } from "./transport/middlewares/require-auth.js"
import { RefreshSessionRepository } from "./repositories/post.prisma.repository.js"


const PORT = 8000
const HOST = "localhost"

const app = express()
const db = new PrismaClient()
const productRepository = createProductRepository(db);
const productService = createProductService(productRepository as unknown as Parameters<typeof createProductService>[0]);
const productHandler = createProductHandler(productService);
const productRouter = createProductRouter(productHandler);
const categoryRepository = createCategoryRepository(db);
const createCategoryService = (categoryServiceModule as any).createCategoryService;
const categoryService = createCategoryService(categoryRepository);
const categoryHandlers = createCategoryHandlers(categoryService);
const categoryRouter = createCategoryRouter(categoryHandlers);

const sessionRepository = new RefreshSessionRepository(db);
const userRepository = createUserRepository(db);
const createAuthService = (userServiceModule as any).createAuthService ?? (userServiceModule as any).createUserService;
const userService = createAuthService(userRepository, 
    { hash: hashPassword, verify: verifyPassword}, 
    { signAccessToken, signRefreshToken},
    { verifyAccessToken, verifyRefreshToken},
    { hash: hashRefreshToken},
    sessionRepository,
)


const userHandler = createUserHandler(userService)
const requireAuth = createRequireAuth(verifyAccessToken)
const userRouter = createUserRouter(
    userHandler as unknown as Parameters<typeof createUserRouter>[0],
    requireAuth,
)

app.use(cors({
    origin: "http://localhost:5173"
}))
app.use(cookieParser())
app.use(express.json());

app.use("/products", productRouter);
app.use("/categories", categoryRouter)
app.use("/auth", userRouter)

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`)
})