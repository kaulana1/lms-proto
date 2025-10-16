import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('demo')
export class DemoController {
  constructor(private readonly db: PrismaService) {}

  @Get('example')
  async example() {
    // Grab any course to show demo data
    const course = await this.db.course.findFirst({
      orderBy: { createdAt: 'asc' },
    });

    if (!course) {
      return { message: 'No courses found. Seed first!' };
    }

    // Find a section within that course
    const section = await this.db.section.findFirst({
      where: { courseId: course.id },
      orderBy: { name: 'asc' },
    });

    // If no section, no assignments
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
}
