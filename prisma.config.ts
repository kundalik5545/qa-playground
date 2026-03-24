import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Direct (non-pooled) URL — required for CLI tools: db push, migrate
    // The pooled DATABASE_URL is passed to PrismaClient at runtime in lib/auth.js
    url: env("DIRECT_URL"),
  },
});
