import { logger } from "../logger/winston.logger";

export interface TaskHandler<T> {
  (taskData: T): Promise<void>;
}

export class ResilientTaskQueue<T> {
  private queue: T[] = [];
  private isProcessing = false;
  private concurrency: number;
  private name: string;

  constructor(name: string, concurrency = 5) {
    this.name = name;
    this.concurrency = concurrency;
  }

  public enqueue(taskData: T, handler: TaskHandler<T>): void {
    this.queue.push(taskData);
    logger.info(`📬 [JOB QUEUE:${this.name}] Enqueued job. Current queue size: ${this.queue.length}`);
    this.processNext(handler).catch((err) => {
      logger.error(`❌ [JOB QUEUE:${this.name}] Processing error: ${err.message}`, { stack: err.stack });
    });
  }

  private async processNext(handler: TaskHandler<T>): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.concurrency);
      const promises = batch.map((item) =>
        handler(item).catch((err) => {
          logger.error(`❌ [JOB QUEUE:${this.name}] Task execution failed: ${err.message}`, { stack: err.stack });
        })
      );

      await Promise.allSettled(promises);
      // Yield execution to Node's Event Loop between batches to prevent HTTP latency spikes
      await new Promise((resolve) => setImmediate(resolve));
    }

    this.isProcessing = false;
  }
}
