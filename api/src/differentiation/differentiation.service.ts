import { Injectable, NotFoundException } from '@nestjs/common'
import { VariantType } from '@prisma/client'
import { OrchestratorService } from '../ai/orchestrator.service'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class DifferentiationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orchestrator: OrchestratorService,
  ){}

  async createVariants(assignmentId: string, teacherId: string) {
    const a = await this.prisma.assignment.findUnique({ where: { id: assignmentId }})
    if(!a) throw new NotFoundException('Assignment not found')

    const easy = await this.prisma.assignmentVariant.create({
      data: {
        assignmentId,
        type: VariantType.LEVEL_EASY,
        title: `${a.title} (Easy)`,
        body: this.orchestrator.makeEasier(a.body ?? ''),
      },
    })

    const ell = await this.prisma.assignmentVariant.create({
      data: {
        assignmentId,
        type: VariantType.ELL,
        title: `${a.title} (ELL)`,
        body: this.orchestrator.addELLGlossary(a.body ?? ''),
      },
    })

    // Minimal ledger example (targeting real students comes later)
    const anyStudent = await this.getAnyStudentIdForAssignment(assignmentId).catch(()=>null)
    if(anyStudent){
      await this.prisma.supportEvent.create({
        data: {
          reason: 'Variants prepared (Easy, ELL)',
          teacherId,
          studentId: anyStudent,
          assignmentVariantId: easy.id,
        }
      })
    }
    return { variants: [easy, ell] }
  }

  async assignVariantToStudents(variantId: string, teacherId: string, studentIds: string[], reason: string){
    const rows = studentIds.map(sid => ({
      reason, teacherId, studentId: sid, assignmentVariantId: variantId
    }))
    await this.prisma.supportEvent.createMany({ data: rows })
    return { ok: true, count: rows.length }
  }

  private async getAnyStudentIdForAssignment(assignmentId: string){
    const a = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { section: { include: { enrollments: true } } }
    })
    const en = a?.section?.enrollments?.find(e => e.role === 'STUDENT')
    if(!en) throw new Error('No student found in section')
    return en.userId
  }
}
