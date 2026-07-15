import { apiClient } from "./apiClient";
import type { Student } from "../types/student";

export const studentService = {
  getAll: async (): Promise<Student[]> => {
    return apiClient.get<Student[]>("students");
  },

  getById: async (id: number): Promise<Student> => {
    const students = await apiClient.get<Student[]>("students");
    const found = students.find((s) => s.id === id);
    if (!found) throw new Error("Student profile not found.");
    return found;
  },

  create: async (student: Omit<Student, "id">): Promise<Student> => {
    return apiClient.post<Student>("students", student);
  },

  update: async (id: number, data: Partial<Student>): Promise<Student> => {
    return apiClient.put<Student>("students", id, data);
  },

  delete: async (id: number): Promise<boolean> => {
    return apiClient.delete("students", id);
  }
};
