import type { RefreshRepository } from "../../domain/post/refresh-session/repository"
import type { UserRepository } from "../../domain/post/user/repository"

export interface PasswordHasher {
    hash(password: string): Promise<string>
    verify(hash: string, password: string): Promise<boolean>
}

interface TokenSigner {
    signRefreshToken(userId: number): string
    signAccessToken(userId: number): string
}

interface TokenVerifier {
    verifyRefreshToken(refreshToken: string): number
}

interface RefreshTokenHasher {
    hash(refreshToken: string): string
}

export interface UserService {
    register(input: { email: string; password: string }): Promise<{ id: number; email: string }>
    login(input: { email: string; password: string }): Promise<{
        user: { id: number; email: string }
        accessToken: string
        refreshToken: string
    }>
    refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }>
    logout(refreshToken: string): Promise<void>
    me(userId: number): Promise<{ id: number; email: string }>
}

export function createAuthService(
    repository: UserRepository, 
    passwordHasher: PasswordHasher, 
    tokenSigner: TokenSigner,
    tokenVerifier: TokenVerifier,
    tokens: RefreshTokenHasher,
    sessions: RefreshRepository
    
): UserService{
    return {
        async register(input: { email: any; password: any }){
            const { email, password } = input
            const passwordHash = await passwordHasher.hash(password)
            const user = await repository.createUser({
                email: email.trim().toLowerCase(),
                hashPassword: passwordHash,
                password: function (_password: any, _password1: string): unknown {
                    throw new Error("Function not implemented.")
                },
                passwordHash: function (_passwordHash: any, _password: string): unknown {
                    throw new Error("Function not implemented.")
                }
            })
            return {
                id: user.id,
                email: user.email
            }
        },
        async login(input: { email: any; password: any; }){
            const { email, password } = input
            const user = await repository.getByEmail(email.trim().toLowerCase())
            if (!user || ! await passwordHasher.verify(user.hashPassword, password)){
                throw new Error("Invalid credentials")
            }
            
            const refreshToken = tokenSigner.signRefreshToken(user.id)
            await sessions.create({
                userId: user.id,
                tokenHash: tokens.hash(refreshToken),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            })
            return {
                user: {
                    id: user.id,
                    email: user.email
                },
                accessToken: tokenSigner.signAccessToken(user.id),
                refreshToken: refreshToken
            }
        },
        async refresh(refreshToken: any){
            const userId = tokenVerifier.verifyRefreshToken(refreshToken)
            const oldHash = tokens.hash(refreshToken)
            const session = await sessions.getByHash(oldHash)
            if (!session || session.userId !== userId || session.expiresAt <= new Date()){
                throw new Error("INVALID_REFRESH_TOKEN")
            }
            const user = await repository.getById(userId)
            if(!user){
                throw new Error("INVALID_REFRESH_TOKEN")
            }
            const newRefreshToken = tokenSigner.signRefreshToken(user.id)
            const isChanged = await sessions.rotate(oldHash, tokens.hash(newRefreshToken), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
            if (!isChanged){
                throw new Error("INVALID_REFRESH_TOKEN")
            }
            return {
                accessToken: tokenSigner.signAccessToken(user.id),
                refreshToken: newRefreshToken
            }
        },
        async logout(refreshToken: any){
            if (!refreshToken) return
            await sessions.deleteByHash(tokens.hash(refreshToken))
        },
        async me(userId: number){
            const user = await repository.getById(userId)

            if(!user){
                throw new Error("UNAUTHORIZED")
            }

            return {
                id: user.id,
                email: user.email
            }
        }
    }
}