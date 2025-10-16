import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AiModule } from './ai/ai.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ActionCardsModule } from './action-cards/action-cards.module';
import { GradingModule } from './grading/grading.module';

@Module({
  imports: [
    AuthModule,
    AiModule,
    AnalyticsModule,
    ActionCardsModule,
    GradingModule,
  ],
})
export class AppModule {}
