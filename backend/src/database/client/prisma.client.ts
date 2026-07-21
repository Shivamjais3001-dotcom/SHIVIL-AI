import { PrismaClient, Prisma } from "@prisma/client";

// Global type declaration to prevent multiple instances during Vite/HMR/TS-Node reloads
const globalForPrisma = global as unknown as { prismaSingleton?: PrismaClient };

/**
 * Determines environment-driven Prisma log levels.
 */
function getLogLevels(): Prisma.LogLevel[] {
  const env = process.env.NODE_ENV || "development";
  switch (env) {
    case "production":
      return ["error", "warn"];
    case "test":
      return ["error"];
    case "development":
    default:
      return ["query", "info", "warn", "error"];
  }
}

/**
 * Creates a new production-ready PrismaClient instance.
 */
function createPrismaClient(): PrismaClient {
  const client = new PrismaClient({
    log: getLogLevels().map((level) => ({
      emit: "event",
      level,
    })),
  });

  // Attach event log listeners for structured logging
  if (process.env.NODE_ENV !== "test") {
    (client as any).$on("error", (e: Prisma.LogEvent) => {
      console.error(`[PRISMA DB ERROR] ${e.message}`, { target: e.target, timestamp: new Date() });
    });

    (client as any).$on("warn", (e: Prisma.LogEvent) => {
      console.warn(`[PRISMA DB WARN] ${e.message}`);
    });

    if (process.env.NODE_ENV === "development" && process.env.ENABLE_QUERY_LOGS === "true") {
      (client as any).$on("query", (e: Prisma.QueryEvent) => {
        console.log(`[PRISMA QUERY] ${e.query} - Params: ${e.params} - Duration: ${e.duration}ms`);
      });
    }
  }

  return client;
}

/**
 * Singleton Prisma Client Instance Manager
 */
export class DatabaseClientManager {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!DatabaseClientManager.instance) {
      if (globalForPrisma.prismaSingleton) {
        DatabaseClientManager.instance = globalForPrisma.prismaSingleton;
      } else {
        DatabaseClientManager.instance = createPrismaClient();
        if (process.env.NODE_ENV !== "production") {
          globalForPrisma.prismaSingleton = DatabaseClientManager.instance;
        }
      }
    }
    return DatabaseClientManager.instance;
  }
}

export const prismaClient = DatabaseClientManager.getInstance();
export default prismaClient;
