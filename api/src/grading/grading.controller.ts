import { BadRequestException, Controller, Post, Body } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Controller('grading')
export class GradingController {
  constructor(private readonly db: PrismaService) {}

  // POST /grading/quick-check { assignmentId: string }
  @Post('quick-check')
  async quickCheck(@Body() body: { assignmentId?: string }) {
    const assignmentId = body?.assignmentId
    if (!assignmentId) throw new BadRequestException('assignmentId is required')

    const assignment = await this.db.assignment.findUnique({ where: { id: assignmentId }})
    if (!assignment) throw new BadRequestException('assignment not found')

    const submissions = await this.db.submission.findMany({
      where: { assignmentId, score: null }
    })

    let graded = 0
    for (const s of submissions) {
      const content = (s as any).content?.toString().toLowerCase() || ''
      let score = 70
      if (content.includes('algorithm') || content.includes('o(')) score = 90
      if (assignment.dueAt && s.createdAt && s.createdAt > assignment.dueAt) {
        score = Math.max(0, score - 10) // late penalty
      }
      await this.db.submission.update({ where: { id: s.id }, data: { score } })
      graded++
    }

    // optional: raise an action card if many low scores
    const lowCount = await this.db.submission.count({
      where: { assignmentId, score: { lt: 70 } }
    })
    if (lowCount >= 3) {
      const sec = await this.db.section.findFirst({
        where: { id: assignment.sectionId },
        select: { courseId: true }
      })
      if (sec?.courseId) {
        await this.db.actionCard.create({
          data: {
            courseId: sec.courseId,
            kind: 'WEAK_STANDARD' as any,
            payload: { assignmentId, note: 'Multiple low scores detected. Consider an easier variant.' }
          }
        })
      }
    }

    return { graded }
  }
}
