import { Controller, Get, Query } from '@nestjs/common'
import { InsightsService } from './insights.service'

@Controller('actions')
export class ActionsController{
  constructor(private readonly svc: InsightsService){}

  @Get('cards')
  cards(@Query('courseId') courseId: string){
    return this.svc.cardsForCourse(courseId)
  }
}
