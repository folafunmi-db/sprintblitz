// import "dotenv/config";
import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { createClient } from "@libsql/client";

dotenv.config();

export const client = createClient(
  process.env.NODE_ENV === "development"
    ? {
        url: process.env.DATABASE_URL as string,
      }
    : {
        url: process.env.DATABASE_URL as string,
        authToken: process.env.DATABASE_AUTH_TOKEN as string,
      }
);

export const db = drizzle(client, { schema });
