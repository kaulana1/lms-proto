import { Injectable } from '@nestjs/common'
import { ActionKind } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class InsightsService {
  constructor(private readonly prisma: PrismaService){}

  async cardsForCourse(courseId: string){
    const assignments = await this.prisma.assignment.findMany({
      where: { section: { courseId } },
      orderBy: { dueAt: 'asc' }
    })
    const soon = assignments.filter(a => a.dueAt && (new Date(a.dueAt).getTime() - Date.now()) < 3*24*3600*1000)
    const cards = soon.slice(0, 3).map(a => ({
      id: `local-${a.id}`,
      kind: ActionKind.WORKLOAD_SPIKE,
      payload: { assignmentId: a.id, title: a.title, dueAt: a.dueAt },
      createdAt: new Date().toISOString()
    }))
    return { cards }
  }
}
