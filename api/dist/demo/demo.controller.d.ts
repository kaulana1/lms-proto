import { PrismaService } from '../prisma/prisma.service';
export declare class DemoController {
    private readonly db;
    constructor(db: PrismaService);
    example(): Promise<{
        message: string;
        course?: undefined;
        section?: undefined;
        assignments?: undefined;
    } | {
        course: {
            id: string;
            title: string;
        };
        section: {
            id: string;
            name: string;
        } | null;
        assignments: {
            id: string;
            title: string;
            dueAt: Date | null;
        }[];
        message?: undefined;
    }>;
}
