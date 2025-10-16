import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}

  async reindex(): Promise<void> {
    // Prototype: no-op (skip embeddings). Real impl would compute/store vectors.
    return;
  }

  async search(q: string, courseId?: string) {
    const query = (q || '').trim();
    if (!query) return [];

    // Pages (title contains query)
    const pages = await this.prisma.page.findMany({
      where: {
        title: { contains: query, mode: 'insensitive' },
        ...(courseId ? { courseId } : {}),
      },
      select: { id: true, title: true, courseId: true },
      take: 10,
    });

    // Assignments (title contains query). In this schema, Assignment -> Section -> Course
    const assignments = await this.prisma.assignment.findMany({
      where: {
        title: { contains: query, mode: 'insensitive' },
        ...(courseId ? { section: { courseId } } : {}),
      },
      select: { id: true, title: true, section: { select: { courseId: true } } },
      take: 10,
    });

    return [
      ...pages.map(p => ({ id: p.id, kind: 'page', title: p.title, courseId: p.courseId })),
      ...assignments.map(a => ({ id: a.id, kind: 'assignment', title: a.title, courseId: a.section?.courseId || null })),
    ].slice(0, 10);
  }
}
