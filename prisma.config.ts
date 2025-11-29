import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.postgres.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_TNSOG7p4YcnP@ep-square-frost-ahkqztsu-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require",
  },
});
