import { Module, Global, OnModuleDestroy } from "@nestjs/common";

import type { Settings } from "@/config/settings";
import { KyselyDatabasePool } from "@/infrastructure/db/kysely/index";
import type { TransactionManager } from "@/infrastructure/db/transaction-manager";
import type { KyselyContext } from "@/infrastructure/db/kysely/context";
import { SETTINGS_TOKEN } from "@/config/settings.module";
import { TRANSACTION_MANAGER_TOKEN } from "@/infrastructure/di/tokens";

/**
 * Database module providing Kysely database pool and transaction manager.
 * This module is global so it can be imported once and used throughout the app.
 *
 * Note: This module depends on SettingsModule (via SETTINGS_TOKEN) which must be
 * imported before DatabaseModule in AppModule.
 */
@Global()
@Module({
  providers: [
    {
      provide: KyselyDatabasePool,
      useFactory: (settings: Settings): KyselyDatabasePool => {
        // Settings is injected from SettingsModule via SETTINGS_TOKEN
        const pool = new KyselyDatabasePool();
        pool.createDatabase(settings);
        return pool;
      },
      inject: [SETTINGS_TOKEN], // Required: tells NestJS which token to inject
    },
    {
      provide: TRANSACTION_MANAGER_TOKEN,
      useFactory: (pool: KyselyDatabasePool): TransactionManager<KyselyContext> => {
        return pool.getTransactionManager();
      },
      inject: [KyselyDatabasePool],
    },
  ],
  exports: [KyselyDatabasePool, TRANSACTION_MANAGER_TOKEN],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(private readonly pool: KyselyDatabasePool) {}

  async onModuleDestroy(): Promise<void> {
    await this.pool.close();
  }
}
