import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly db: PrismaService) {}

  async login(email: string, password: string) {
    const user = await this.db.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // Support both hashed and (for emergencies) plaintext seeds
    const hashed = (user as any).passwordHash as string | null | undefined;
    const plain  = (user as any).password as string | null | undefined;

    let ok = false;
    if (hashed) ok = await bcrypt.compare(password, hashed);
    else if (plain) ok = plain === password;

    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const secret = process.env.JWT_SECRET || 'dev-super-secret';
    const token = jwt.sign(
      {
        sub: user.id,
        role: user.role,
        tenantId: user.tenantId,
        schoolId: user.schoolId,
        email: user.email,
      },
      secret,
      { expiresIn: '8h' }
    );

    return { token };
  }
}
