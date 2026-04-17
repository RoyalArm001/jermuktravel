import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://postgres:password@localhost:5432/jermuktravel?schema=public";

const defaultConnectionString =
  "postgresql://postgres:password@localhost:5432/jermuktravel?schema=public";

export const isDatabaseConfigured =
  Boolean(process.env.DATABASE_URL) &&
  connectionString !== defaultConnectionString &&
  !connectionString.includes("replace-with");

const adapter = new PrismaPg({
  connectionString,
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
