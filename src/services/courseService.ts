import { apiClient } from "./apiClient";
import type { CourseType } from "../types/course";

export const courseService = {
  getAll: async (): Promise<CourseType[]> => {
    return apiClient.get<CourseType[]>("courses");
  },

  create: async (course: Omit<CourseType, "id">): Promise<CourseType> => {
    return apiClient.post<CourseType>("courses", course);
  },

  update: async (id: number, data: Partial<CourseType>): Promise<CourseType> => {
    return apiClient.put<CourseType>("courses", id, data);
  },

  delete: async (id: number): Promise<boolean> => {
    return apiClient.delete("courses", id);
  }
};
