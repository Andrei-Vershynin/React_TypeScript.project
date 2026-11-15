export interface User{
    passwordHash(passwordHash: any, password: string): unknown;
    password(password: any, password1: string): unknown;
    id: number;
    email: string;
    hashPassword: string;
}

export type PublicUser = Pick<User, "id" | "email">