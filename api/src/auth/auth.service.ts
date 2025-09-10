import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

  async validateUser(email: string, password: string) {
    const demoTenantId = this.config.get<string>('DEMO_TENANT_ID') ?? '00000000-0000-0000-0000-000000000001'
    // IMPORTANT: run under a tenant session so RLS allows the read
    const user = await this.prisma.withTenant(demoTenantId, (db) =>
      db.user.findUnique({ where: { email } })
    )
    if (!user) throw new UnauthorizedException()
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) throw new UnauthorizedException()
    return user
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password)
    const payload = { sub: user.id, role: user.role, tenantId: user.tenantId, schoolId: user.schoolId ?? null, email: user.email }
    const token = await this.jwt.signAsync(payload, { secret: this.config.get<string>('JWT_SECRET')!, expiresIn: '8h' })
    return { token }
  }
}
