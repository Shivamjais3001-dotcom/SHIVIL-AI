import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { runAllSeeds, SeedResult } from "./seeds";

// Load environment variables (.env)
dotenv.config();

const prisma = new PrismaClient();

function printSeedSummary(results: SeedResult[]) {
  console.log("\n==================================================");
  console.log("📊 SEED EXECUTION SUMMARY REPORT");
  console.log("==================================================");

  let totalCreated = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const res of results) {
    console.log(
      `• ${res.category.padEnd(28)} | Created: ${String(res.created).padStart(3)} | Skipped: ${String(res.skipped).padStart(3)} | Failed: ${String(res.failed).padStart(3)}`
    );
    totalCreated += res.created;
    totalSkipped += res.skipped;
    totalFailed += res.failed;
  }

  console.log("--------------------------------------------------");
  console.log(
    `TOTAL SUMMARY: Created: ${totalCreated} | Skipped: ${totalSkipped} | Failed: ${totalFailed}`
  );
  console.log("==================================================\n");

  if (totalFailed > 0) {
    throw new Error(`Seeding pipeline completed with ${totalFailed} failure(s).`);
  }
}

async function main() {
  const startTime = Date.now();
  console.log("🚀 [SHIVIL AI SEED ENGINE] Initializing production database seed...");

  try {
    // Run seed modules within transactional context
    const results = await prisma.$transaction(async (txPrisma) => {
      return await runAllSeeds(txPrisma as PrismaClient);
    });

    printSeedSummary(results);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ [SEED ENGINE] Seeding completed successfully in ${duration}s 🌱`);
  } catch (error) {
    console.error("❌ [FATAL SEED ERROR] Seeding pipeline failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
