import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ActionCardsService } from './action-cards.service';

@Controller('action-cards')
export class ActionCardsController {
  constructor(private readonly svc: ActionCardsService) {}

  @Get()
  async list(@Query('courseId') courseId?: string) {
    if (!courseId) throw new BadRequestException('courseId is required');
    return this.svc.list(courseId);
  }
}
