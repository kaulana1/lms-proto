import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActionCardsService {
  constructor(private readonly db: PrismaService) {}

  async list(courseId: string) {
    let cards = await this.db.actionCard.findMany({
      where: { courseId },
      orderBy: { createdAt: 'desc' },
    });

    // Seed a few demo cards if none exist
    if (cards.length === 0) {
      const payloads = [
        { kind: 'LATE_SUBMISSIONS', payload: { count: 3, students: ['A.R.', 'B.S.', 'C.T.'], assignmentTitle: 'HW 1' } },
        { kind: 'WEAK_STANDARD',    payload: { standard: 'CCSS.MATH.CONTENT.7.EE.B.3', recommendation: 'Assign LEVEL_EASY variant for 5 students' } },
        { kind: 'WORKLOAD_SPIKE',   payload: { next7DaysDue: 6, suggestion: 'Stagger due dates or auto-extend 24h for flagged students' } },
      ];
      for (const p of payloads) {
        await this.db.actionCard.create({ data: { courseId, kind: p.kind as any, payload: p.payload as any } });
      }
      cards = await this.db.actionCard.findMany({ where: { courseId }, orderBy: { createdAt: 'desc' } });
    }

    return { cards };
  }
}
