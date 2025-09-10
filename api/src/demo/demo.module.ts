import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { DemoController } from './demo.controller'

@Module({
  imports: [JwtModule.register({})],
  controllers: [DemoController],
})
export class DemoModule {}
