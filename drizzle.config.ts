import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default {
  schema: "./src/db/app/schema.ts",
  out: "./drizzle/migrations",
  strict: true,
  verbose: true,
  ...(process.env.DATABASE_AUTH_TOKEN && process.env.NODE_ENV == "production"
    ? {
        driver: "turso",
        dbCredentials: {
          url: process.env.DATABASE_URL as string,
          authToken: process.env.DATABASE_AUTH_TOKEN as string,
        },
      }
    : {
        driver: "libsql",
        dbCredentials: { url: process.env.DATABASE_URL ?? "" },
      }),
} satisfies Config;
