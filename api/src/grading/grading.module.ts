import { Module } from '@nestjs/common'
import { GradingController } from './grading.controller'
import { PrismaService } from '../prisma/prisma.service'

@Module({
  controllers: [GradingController],
  providers: [PrismaService],
})
export class GradingModule {}
