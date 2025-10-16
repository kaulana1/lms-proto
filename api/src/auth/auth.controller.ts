import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    if (!body?.email || !body?.password) {
      return { message: 'email and password are required' };
    }
    return this.auth.login(body.email, body.password);
  }
}
