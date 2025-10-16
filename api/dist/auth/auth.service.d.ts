import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private readonly db;
    constructor(db: PrismaService);
    login(email: string, password: string): Promise<{
        token: string;
    }>;
}
