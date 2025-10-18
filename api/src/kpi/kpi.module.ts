import { Module } from '@nestjs/common';
import { KpiController } from './kpi.controller';
import { KpiService } from './kpi.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [KpiController],
  providers: [KpiService, PrismaService],
  exports: [KpiService]
})
export class KpiModule {}
