import { Body, Controller, Param, Post } from '@nestjs/common'
import { DifferentiationService } from './differentiation.service'

@Controller('diff')
export class DifferentiationController {
  constructor(private readonly svc: DifferentiationService) {}

  @Post('assignments/:id/create-variants')
  createVariants(@Param('id') id: string, @Body('teacherId') teacherId: string){
    return this.svc.createVariants(id, teacherId)
  }

  @Post('variants/:id/assign')
  assign(@Param('id') id: string, @Body() body: { teacherId: string, studentIds: string[], reason?: string }){
    return this.svc.assignVariantToStudents(id, body.teacherId, body.studentIds, body.reason ?? 'Targeted support')
  }
}
