import { Controller, Get } from '@nestjs/common'

@Controller()
export class HealthController {
  @Get('health')
  health() {
    return { ok: true, now: new Date().toISOString(), uptime: process.uptime() }
  }
}
