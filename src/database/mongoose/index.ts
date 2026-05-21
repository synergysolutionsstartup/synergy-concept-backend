import { connectDB, dbClient, shutdownDB, parseDbError } from "@src/database/mongoose/connection";
import { AppDao, AppDaoFactory } from "@src/database/mongoose/dao/_index";

export interface Database {
  connectDB: () => Promise<void>;
  dbClient: typeof dbClient;
  shutdownDB: () => Promise<void>;
  parseDbError: (error: any) => Record<string, any>;
  AppDao: AppDaoFactory;
}

export const db: Database = {
  connectDB,
  dbClient,
  shutdownDB,
  parseDbError,
  AppDao,
};
