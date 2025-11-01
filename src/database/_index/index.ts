// DATAASE INDEX.TS FILE
// Export out the correct database implementation you want the application to use
// either mongoose/mongodb or prisma

import { PrismaClient, Prisma } from "@src/database/client";
import {
  connectDB,
  dbClient,
  shutdownDB,
  parseDbError
} from "@src/database/prisma/connection";
 import { AppDao , AppDaoFactory} from "@src/database/prisma/dao/_index";


type PrismaType  = typeof Prisma
export type { Prisma } from "@src/database/client";

export interface Database {
  connectDB: () => Promise<void>;
  dbClient: PrismaClient;
  Prisma: PrismaType,
  shutdownDB: () => Promise<void>;
  parseDbError: (error: any)=> Record<string, any>,
  AppDao: AppDaoFactory
  //   dbClient: unknown; // fallback if you don’t want strict typing
}

export const db: Database = {
  connectDB: () => connectDB(),
  dbClient: dbClient,
  shutdownDB,
  Prisma,
  parseDbError,
  AppDao,
};


