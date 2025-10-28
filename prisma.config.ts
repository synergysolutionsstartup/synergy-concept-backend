// prisma.config.ts

import path from "node:path";
import type { PrismaConfig } from "prisma";
// prisma.config.ts
import dotenv from 'dotenv';

// ✅ Load your environment variables manually
dotenv.config();

export default {
  schema: path.join("src", "database", "prisma"),

} satisfies PrismaConfig;
