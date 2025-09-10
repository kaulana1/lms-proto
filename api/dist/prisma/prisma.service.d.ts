import { OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit {
    onModuleInit(): Promise<void>;
    withTenant<T>(tenantId: string, fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T>;
}
