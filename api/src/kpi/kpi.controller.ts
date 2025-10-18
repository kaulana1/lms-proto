import { Controller, Get, Param, Req } from '@nestjs/common';
import { KpiService } from './kpi.service';

@Controller('kpi')
export class KpiController {
  constructor(private service: KpiService) {}

  @Get(':courseId')
  async byCourse(@Param('courseId') courseId: string, @Req() req: any) {
    const sid = (req.user && req.user.id) || (req.query && String(req.query.studentId));
    if (!sid) return { error: 'Missing studentId' };
    return this.service.getStudentCourseKpis(String(sid), courseId);
  }
}
