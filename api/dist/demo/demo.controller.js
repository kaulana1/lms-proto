"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DemoController = class DemoController {
    constructor(db) {
        this.db = db;
    }
    async example() {
        const course = await this.db.course.findFirst({
            orderBy: { createdAt: 'asc' },
        });
        if (!course) {
            return { message: 'No courses found. Seed first!' };
        }
        const section = await this.db.section.findFirst({
            where: { courseId: course.id },
            orderBy: { name: 'asc' },
        });
        const assignments = section
            ? await this.db.assignment.findMany({
                where: { sectionId: section.id },
                orderBy: { createdAt: 'desc' },
            })
            : [];
        return {
            course: { id: course.id, title: course.title },
            section: section ? { id: section.id, name: section.name } : null,
            assignments: assignments.map((a) => ({
                id: a.id,
                title: a.title,
                dueAt: a.dueAt,
            })),
        };
    }
};
exports.DemoController = DemoController;
__decorate([
    (0, common_1.Get)('example'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DemoController.prototype, "example", null);
exports.DemoController = DemoController = __decorate([
    (0, common_1.Controller)('demo'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DemoController);
//# sourceMappingURL=demo.controller.js.map