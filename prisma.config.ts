import path from "path";
import { defineConfig } from "prisma/config";
import { config as loadEnv } from "dotenv";

// Prisma CLI doesn't load .env.local automatically — load it here
loadEnv({ path: path.join(process.cwd(), ".env.local") });

export default defineConfig({
  schema: path.join(process.cwd(), "prisma/schema.prisma"),
  datasource: {
    // DIRECT_URL bypasses PgBouncer pooler — required for migrations
    url: process.env.DIRECT_URL,
  },
});
