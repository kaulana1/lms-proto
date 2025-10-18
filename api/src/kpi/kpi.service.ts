import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { subDays, startOfDay } from 'date-fns';

@Injectable()
export class KpiService {
  constructor(private prisma: PrismaService) {}

  async getStudentCourseKpis(studentId: string, courseId: string) {
    const enroll = await this.prisma.enrollment.findMany({
      where: { userId: studentId, role: 'STUDENT' },
      select: { sectionId: true, section: { select: { courseId: true } } }
    });
    const sectionIds = enroll.filter(e => e.section.courseId === courseId).map(e => e.sectionId);
    const [assignmentsTotal, assignmentsDone] = await Promise.all([
      this.prisma.assignment.count({ where: { sectionId: { in: sectionIds } } }),
      this.prisma.submission.count({ where: { studentId, assignment: { sectionId: { in: sectionIds } } } })
    ]);
    const [correct, total] = await Promise.all([
      this.prisma.kpiEvent.aggregate({ where: { studentId, courseId, type: 'QUIZ_CORRECT' }, _sum: { value: true } }),
      this.prisma.kpiEvent.aggregate({ where: { studentId, courseId, type: 'QUIZ_TOTAL' }, _sum: { value: true } })
    ]);
    const compHit = correct._sum.value ?? 0;
    const compTot = total._sum.value ?? 0;
    const since = subDays(new Date(), 7);
    const practice = await this.prisma.kpiEvent.findMany({
      where: { studentId, courseId, type: 'PRACTICE_SESSION', createdAt: { gte: since } },
      select: { createdAt: true }
    });
    const uniqueDays = new Set(practice.map(p => startOfDay(p.createdAt).toISOString())).size;
    const snapshot = await this.prisma.kpiSnapshot.upsert({
      where: { studentId_courseId: { studentId, courseId } },
      update: { assignmentsDone, assignmentsTotal, comprehensionHit: compHit, comprehensionTot: compTot, practiceDays7: uniqueDays },
      create: { studentId, courseId, assignmentsDone, assignmentsTotal, comprehensionHit: compHit, comprehensionTot: compTot, practiceDays7: uniqueDays }
    });
    const completion = assignmentsTotal ? Math.round((assignmentsDone / assignmentsTotal) * 100) : 0;
    const comprehension = compTot ? Math.round((compHit / compTot) * 100) : 0;
    const practicePct = Math.min(100, Math.round((uniqueDays / 7) * 100));
    return {
      completion, assignmentsDone, assignmentsTotal,
      comprehension, compHit, compTot,
      practice: practicePct, practiceDays7: uniqueDays,
      updatedAt: snapshot.updatedAt
    };
  }
}
