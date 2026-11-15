import type { UserRepository } from "../domain/post/user/repository.js";
export type { UserRepository } from "../domain/post/user/repository.js";

type Database = { orm: { public: { User: any } } };

export function createUserRepository(database: Database): UserRepository {
    return {
        async createUser(data: any) {
            try {
                return await database.orm.public.User
                    .create(data)
            } catch (error) {
                if (error instanceof Error && 'sqlState' in error && 
                    error.sqlState === "23505"
                ) {
                    throw new Error('Email already exists');
                }
                throw error
            }
        },
        async getByEmail(email: any) {
            return await database.orm.public.User
                .where({email})
                .first()
        },
        async getById(id: any){
            return await database.orm.public.User
                .where({id})
                .first()
        }
    }
}