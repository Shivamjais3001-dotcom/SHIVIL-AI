import prisma from "../config/database";

export class AIRepository {
  async findByUserId(userId: string) {
    return prisma.aIConversation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" }
    });
  }

  async create(data: { userId: string; history: any; context?: string }) {
    return prisma.aIConversation.create({
      data: {
        userId: data.userId,
        history: data.history || [],
        context: data.context || ""
      }
    });
  }
}
