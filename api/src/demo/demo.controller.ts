import { Controller, Get, Headers } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'

@Controller('demo')
export class DemoController {
  constructor(private prisma: PrismaService, private jwt: JwtService){}

  @Get('overview')
  async overview(@Headers('authorization') auth?: string){
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
    if(!token) return { error: true }
    const payload: any = this.jwt.decode(token) as any
    if(!payload?.tenantId) return { error: true }

    return this.prisma.withTenant(payload.tenantId, async (db) => {
      const course = await db.course.findFirst({})
      if(!course) return { error: true }
      const section = await db.section.findFirst({ where: { courseId: course.id }})
      const pages = await db.page.findMany({ where: { courseId: course.id }})
      const assignments = await db.assignment.findMany({ where: { courseId: course.id }})
      return { course, section, pages, assignments }
    })
  }
}
