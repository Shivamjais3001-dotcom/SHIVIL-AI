import { DashboardRepository } from "../repositories/dashboard.repository";

const dashboardRepository = new DashboardRepository();

export class DashboardService {
  async getMetrics(universityId: string | null) {
    return dashboardRepository.getMetrics(universityId);
  }
}
