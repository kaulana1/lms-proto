import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class DemoController {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    overview(auth?: string): Promise<{
        course: {
            id: string;
            title: string;
            tenantId: string;
            schoolId: string | null;
        };
        section: {
            id: string;
            name: string;
            courseId: string;
        } | null;
        pages: {
            id: string;
            title: string;
            courseId: string;
            content: string;
        }[];
        assignments: {
            id: string;
            title: string;
            courseId: string;
            dueAt: Date;
        }[];
        error?: undefined;
    } | {
        error: boolean;
    }>;
}
