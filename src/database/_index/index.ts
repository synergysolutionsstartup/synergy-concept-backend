// DATABASE INDEX.TS FILE
// Export out the current database implementation in use.
// The database implementation folders contain the concrete adapters.

import { db as mongooseDb } from "@src/database/mongoose/index";
export interface Database {
  connectDB: () => Promise<void>;
  dbClient: any;
  shutdownDB: () => Promise<void>;
  parseDbError: (error: any) => Record<string, any>;
  AppDao: any;
}

export const db: Database = {
  connectDB: mongooseDb.connectDB,
  dbClient: mongooseDb.dbClient,
  shutdownDB: mongooseDb.shutdownDB,
  parseDbError: mongooseDb.parseDbError,
  AppDao: mongooseDb.AppDao,
};


