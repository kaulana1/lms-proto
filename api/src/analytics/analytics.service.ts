import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type Overview = {
  completionRate: number;
  lateRate: number;
  avgScore: number;
  counts: { pages: number; assignments: number; submissions: number; students: number };
};

@Injectable()
export class AnalyticsService {
  constructor(private readonly db: PrismaService) {}

  // Return first course as { id, name } (map title -> name for UI)
  async firstCourse() {
    const c = await this.db.course.findFirst({
      select: { id: true, title: true },
    });
    if (!c) return { id: null, name: null };
    return { id: c.id, name: c.title };
  }

  async overview(courseId: string): Promise<Overview> {
    const [pages, assignments, submissions] = await Promise.all([
      this.db.page.count({ where: { courseId } }),
      this.db.assignment.count({ where: { section: { courseId } } }),
      this.db.submission.count({ where: { assignment: { section: { courseId } } } }),
    ]);

    const students = await this.db.user.count().catch(() => 0);

    // Simple placeholder KPIs for the prototype
    const denom = Math.max(1, assignments * Math.max(1, students));
    const completionRate = Math.min(100, Math.round((submissions / denom) * 100));
    const lateRate = Math.max(0, 20 - (pages % 15)); // placeholder
    const avgScore = 80; // placeholder

    return {
      completionRate,
      lateRate,
      avgScore,
      counts: { pages, assignments, submissions, students },
    };
  }
}
