import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly svc: AnalyticsService) {}

  @Get('first-course')
  async firstCourse() {
    return this.svc.firstCourse();
  }

  @Get('overview')
  async overview(@Query('courseId') courseId?: string) {
    if (!courseId) throw new BadRequestException('courseId is required');
    return this.svc.overview(courseId);
  }
}
