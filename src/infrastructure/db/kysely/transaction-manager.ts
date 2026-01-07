import { Kysely } from "kysely";
import type { TransactionManager } from "../transaction-manager";
import { KyselyContext } from "./context";
import { DB } from "./schema";

export class KyselyTransactionManager implements TransactionManager<KyselyContext> {
  constructor(private readonly db: Kysely<DB>) {}

  async transaction<U>(fn: (ctx: KyselyContext) => Promise<U>): Promise<U> {
    return this.db.transaction().execute(async (trx) => {
      const ctx: KyselyContext = { db: trx };
      return fn(ctx);
    });
  }
}
