import { AIRepository } from "../repositories/ai.repository";

const aiRepository = new AIRepository();

export class AIService {
  async getConversations(userId: string) {
    return aiRepository.findByUserId(userId);
  }

  async saveConversation(data: { userId: string; history: any; context?: string }) {
    return aiRepository.create(data);
  }
}
