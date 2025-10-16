import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient, Prisma } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
  }

  /**
   * Run all Prisma calls inside a transaction where we set a session tenant id.
   * RLS policies read it via current_setting('app.tenant_id', true)
   */
  async withTenant<T>(
    tenantId: string,
    fn: (tx: Prisma.TransactionClient) => Promise<T>
  ) {
    return this.$transaction(async (tx) => {
      // Session config for this transaction only
      await tx.$queryRawUnsafe(
        `SELECT set_config('app.tenant_id', '${tenantId}', true)`
      )
      return fn(tx)
    })
  }
}
