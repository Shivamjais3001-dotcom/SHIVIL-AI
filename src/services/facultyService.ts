import { apiClient } from "./apiClient";
import type { Faculty } from "../types/faculty";

export const facultyService = {
  getAll: async (): Promise<Faculty[]> => {
    return apiClient.get<Faculty[]>("faculty");
  },

  create: async (faculty: Omit<Faculty, "id">): Promise<Faculty> => {
    return apiClient.post<Faculty>("faculty", faculty);
  },

  update: async (id: number, data: Partial<Faculty>): Promise<Faculty> => {
    return apiClient.put<Faculty>("faculty", id, data);
  },

  delete: async (id: number): Promise<boolean> => {
    return apiClient.delete("faculty", id);
  }
};
