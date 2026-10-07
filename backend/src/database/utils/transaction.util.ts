import { PrismaClient, Prisma } from "@prisma/client";
import prisma from "../../config/database";

export interface TransactionOptions {
  maxWait?: number; // Maximum time Prisma Client will wait to acquire transaction lock (default: 2000ms)
  timeout?: number; // Maximum time interactive transaction can run (default: 5000ms)
  isolationLevel?: Prisma.TransactionIsolationLevel;
}

export class TransactionHelper {
  public static async runInTransaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
    options?: TransactionOptions,
    customClient?: PrismaClient
  ): Promise<T> {
    const client = customClient || (prisma as any);
    return client.$transaction(
      async (tx: any) => {
        return await fn(tx);
      },
      {
        maxWait: options?.maxWait ?? 2000,
        timeout: options?.timeout ?? 5000,
        isolationLevel: options?.isolationLevel,
      }
    );
  }
}
