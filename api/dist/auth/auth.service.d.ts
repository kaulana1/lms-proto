import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    validateUser(email: string, password: string): Promise<{
        id: string;
        tenantId: string;
        schoolId: string | null;
        email: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
    login(email: string, password: string): Promise<{
        token: string;
    }>;
}
