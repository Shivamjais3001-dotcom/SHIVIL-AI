import { PrismaClient } from "@prisma/client";
import { prismaClient } from "../client/prisma.client";
import { DatabaseHealthService, DatabaseHealthResponse } from "../health/database.health";

export class DatabaseService {
  private static isConnected = false;
  private static isShuttingDown = false;
  private static readClientInstance: PrismaClient | null = null;

  /**
   * Establishes database connection with exponential backoff retries.
   */
  public static async connect(maxRetries = 5, initialDelayMs = 500): Promise<void> {
    if (this.isConnected) return;

    let attempt = 0;
    let delay = initialDelayMs;

    while (attempt < maxRetries) {
      try {
        attempt++;
        console.log(`🔌 [DATABASE SERVICE] Attempting connection to PostgreSQL (Attempt ${attempt}/${maxRetries})...`);
        
        await prismaClient.$connect();
        this.isConnected = true;
        console.log("✅ [DATABASE SERVICE] Successfully connected to PostgreSQL Cluster.");
        
        this.setupGracefulShutdown();
        return;
      } catch (error) {
        console.error(`⚠️ [DATABASE SERVICE] Connection attempt ${attempt} failed:`, error);
        
        if (attempt >= maxRetries) {
          console.error("❌ [DATABASE SERVICE] Max retries reached. Database connection failed.");
          throw error;
        }

        // Exponential backoff delay
        console.log(`⏳ [DATABASE SERVICE] Waiting ${delay}ms before next retry...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
  }

  /**
   * Safely disconnects the Prisma client.
   */
  public static async disconnect(): Promise<void> {
    if (!this.isConnected) return;

    try {
      console.log("🔌 [DATABASE SERVICE] Draining connection pool and disconnecting Prisma Client...");
      await prismaClient.$disconnect();
      if (this.readClientInstance) {
        await this.readClientInstance.$disconnect();
      }
      this.isConnected = false;
      console.log("✅ [DATABASE SERVICE] Database client disconnected cleanly.");
    } catch (error) {
      console.error("❌ [DATABASE SERVICE] Error during disconnect:", error);
    }
  }

  /**
   * Runs database health diagnostic check.
   */
  public static async healthCheck(): Promise<DatabaseHealthResponse> {
    return DatabaseHealthService.checkHealth(prismaClient);
  }

  /**
   * Architecture Hook for Read Replicas.
   * If READ_REPLICA_URL is configured, returns a secondary PrismaClient instance.
   */
  public static getReadClient(): PrismaClient {
    const replicaUrl = process.env.READ_REPLICA_URL;
    if (!replicaUrl) {
      return prismaClient;
    }

    if (!this.readClientInstance) {
      this.readClientInstance = new PrismaClient({
        datasources: {
          db: {
            url: replicaUrl,
          },
        },
      });
    }
    return this.readClientInstance;
  }

  /**
   * Registers SIGINT & SIGTERM signal listeners to ensure clean pool shutdown.
   */
  public static setupGracefulShutdown(): void {
    if (this.isShuttingDown) return;

    const handleShutdown = async (signal: string) => {
      if (this.isShuttingDown) return;
      this.isShuttingDown = true;

      console.log(`\n⚠️ [DATABASE SERVICE] Received ${signal}. Initiating graceful database shutdown...`);
      await this.disconnect();
      process.exit(0);
    };

    process.once("SIGINT", () => handleShutdown("SIGINT"));
    process.once("SIGTERM", () => handleShutdown("SIGTERM"));
  }
}
