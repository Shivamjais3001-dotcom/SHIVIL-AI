import { createClient, RedisClientType } from "redis";
import { env } from "./env.config";
import { logger } from "../common/logger/winston.logger";

let redisClient: RedisClientType | null = null;
let isConnected = false;

export async function getRedisClient(): Promise<RedisClientType | null> {
  if (redisClient && isConnected) {
    return redisClient;
  }

  try {
    redisClient = createClient({
      url: env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 5) {
            logger.warn("⚠️ [REDIS] Maximum reconnection attempts reached. Falling back to non-cached database mode.");
            return new Error("Redis connection exhausted");
          }
          return Math.min(retries * 500, 3000);
        }
      }
    }) as RedisClientType;

    redisClient.on("error", (err) => {
      logger.warn(`⚠️ [REDIS WARNING] Redis Client Error: ${err.message}`);
      isConnected = false;
    });

    redisClient.on("connect", () => {
      logger.info("⚡ [REDIS] Connected to Redis Cache Cluster successfully.");
      isConnected = true;
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.warn(`⚠️ [REDIS] Could not establish connection to ${env.REDIS_URL}. Operating with graceful fallback.`);
    isConnected = false;
    return null;
  }
}

export function isRedisAvailable(): boolean {
  return isConnected;
}
