import { Controller, Get, Post, Query, Req } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post('reindex')
  async reindex(@Req() _req: any) {
    await this.ai.reindex();
    return { ok: true };
  }

  @Get('search')
  async search(
    @Query('q') q: string,
    @Query('courseId') courseId?: string,
    @Req() _req?: any,
  ) {
    const results = await this.ai.search(q || '', courseId || undefined);
    return { results };
  }
}
