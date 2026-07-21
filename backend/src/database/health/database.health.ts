import { PrismaClient } from "@prisma/client";
import { prismaClient } from "../client/prisma.client";

export interface DatabaseHealthMetrics {
  activeConnectionsPlaceholder: number;
  connectionPoolCapacity: number;
  readReplicaStatus: "ACTIVE" | "STANDBY" | "DISABLED";
}

export interface DatabaseHealthResponse {
  status: "CONNECTED" | "DISCONNECTED";
  latencyMs: number;
  version: string;
  timestamp: string;
  metrics: DatabaseHealthMetrics;
}

export class DatabaseHealthService {
  public static async checkHealth(client: PrismaClient = prismaClient): Promise<DatabaseHealthResponse> {
    const startTime = Date.now();
    try {
      // Execute raw query to measure latency and retrieve PostgreSQL version
      const result = await client.$queryRaw<Array<{ version: string }>>`SELECT version();`;
      const latencyMs = Date.now() - startTime;
      const rawVersion = result[0]?.version || "PostgreSQL 16.x";

      // Extract simplified version string
      const version = rawVersion.split(" ")[0] || rawVersion;

      return {
        status: "CONNECTED",
        latencyMs,
        version,
        timestamp: new Date().toISOString(),
        metrics: {
          activeConnectionsPlaceholder: 12,
          connectionPoolCapacity: 50,
          readReplicaStatus: process.env.READ_REPLICA_URL ? "ACTIVE" : "DISABLED",
        },
      };
    } catch (error) {
      console.error("[DATABASE HEALTH CHECK FAILURE]", error);
      return {
        status: "DISCONNECTED",
        latencyMs: Date.now() - startTime,
        version: "UNKNOWN",
        timestamp: new Date().toISOString(),
        metrics: {
          activeConnectionsPlaceholder: 0,
          connectionPoolCapacity: 50,
          readReplicaStatus: "DISABLED",
        },
      };
    }
  }
}
