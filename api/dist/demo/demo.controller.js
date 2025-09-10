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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
let DemoController = class DemoController {
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async overview(auth) {
        const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
        if (!token)
            return { error: true };
        const payload = this.jwt.decode(token);
        if (!payload?.tenantId)
            return { error: true };
        return this.prisma.withTenant(payload.tenantId, async (db) => {
            const course = await db.course.findFirst({});
            if (!course)
                return { error: true };
            const section = await db.section.findFirst({ where: { courseId: course.id } });
            const pages = await db.page.findMany({ where: { courseId: course.id } });
            const assignments = await db.assignment.findMany({ where: { courseId: course.id } });
            return { course, section, pages, assignments };
        });
    }
};
exports.DemoController = DemoController;
__decorate([
    (0, common_1.Get)('overview'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DemoController.prototype, "overview", null);
exports.DemoController = DemoController = __decorate([
    (0, common_1.Controller)('demo'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService])
], DemoController);
//# sourceMappingURL=demo.controller.js.map