
// CONNECTIONS.TS File (Prisma)
// THis file contains the implementation to connet to the database using prisma
// NOTE: DO NOT CALL THE METHOD HERE
// JUST DEFINE THE FUNCTION AND EXPORT IT OUT TO THE REPOSITORY

import { PrismaClient, Prisma } from "@src/database/client";
export const dbClient = new PrismaClient(); /// create a prisma client

export type DbClient = typeof dbClient;

export async function connectDB() {
  try {
    await dbClient.$connect();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

export async function shutdownDB() {
  await dbClient.$disconnect();
  console.log("🔌 Prisma disconnected");
}
