import { apiClient } from "./apiClient";
import type { Student } from "../types/student";
import type { Faculty } from "../types/faculty";
import type { CourseType } from "../types/course";

export interface DashboardStats {
  activeStudents: number;
  activeFaculty: number;
  totalCourses: number;
  averageAttendance: string;
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const students = await apiClient.get<Student[]>("students");
    const faculty = await apiClient.get<Faculty[]>("faculty");
    const courses = await apiClient.get<CourseType[]>("courses");

    return {
      activeStudents: students.length,
      activeFaculty: faculty.length,
      totalCourses: courses.length,
      averageAttendance: "88.5%"
    };
  }
};
