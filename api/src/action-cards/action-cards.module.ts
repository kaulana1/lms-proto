import { Module } from '@nestjs/common';
import { ActionCardsController } from './action-cards.controller';
import { ActionCardsService } from './action-cards.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ActionCardsController],
  providers: [ActionCardsService, PrismaService],
})
export class ActionCardsModule {}
