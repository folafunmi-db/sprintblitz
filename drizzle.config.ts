import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";
// import "dotenv/config";

dotenv.config();

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
  strict: true,
  verbose: true,
  ...(process.env.DATABASE_AUTH_TOKEN && process.env.NODE_ENV == "production"
    ? {
        dialect: "sqlite",
        driver: "turso",
        dbCredentials: {
          url: process.env.DATABASE_URL as string,
          authToken: process.env.DATABASE_AUTH_TOKEN as string,
        },
      }
    : {
        dialect: "sqlite",
        driver: "libsql",
        dbCredentials: { url: process.env.DATABASE_URL ?? "" },
      }),
} satisfies Config);
