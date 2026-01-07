import type { DB } from "./schema";
import type { Kysely, Transaction } from "kysely";

/**
 * Kysely-specific implementation of DatabaseContext.
 *
 * This provides a type-safe way to access the database using Kysely's query builder
 * while maintaining transaction support through Kysely's transaction API.
 */
export interface KyselyContext {
  db: Kysely<DB> | Transaction<DB>;
}
