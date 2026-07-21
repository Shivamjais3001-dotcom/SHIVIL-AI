import { apiClient } from "./apiClient";
import type { CourseType } from "../types/course";

const normalizeCourse = (c: any): CourseType => ({
  id: c.id,
  courseCode: c.courseCode || c.code || "CS-101",
  courseName: c.courseName || c.name || "Untitled Course",
  department: c.department || c.departmentName || "Computer Science",
  credits: c.credits ?? 4,
  semester: c.semester || "Semester I"
});

export const courseService = {
  getAll: async (): Promise<CourseType[]> => {
    try {
      const data = await apiClient.get<any>("courses");
      const list = Array.isArray(data) ? data : data?.data || [];
      return Array.isArray(list) ? list.map(normalizeCourse) : [];
    } catch (err) {
      console.error("Error fetching courses, returning empty fallback", err);
      return [];
    }
  },

  create: async (course: Omit<CourseType, "id">): Promise<CourseType> => {
    const res = await apiClient.post<any>("courses", {
      code: course.courseCode,
      name: course.courseName,
      department: course.department,
      credits: Number(course.credits),
      semester: String(course.semester)
    });
    return normalizeCourse(res);
  },

  update: async (id: number, data: Partial<CourseType>): Promise<CourseType> => {
    const res = await apiClient.put<any>("courses", id, {
      code: data.courseCode,
      name: data.courseName,
      department: data.department,
      credits: data.credits ? Number(data.credits) : undefined,
      semester: data.semester ? String(data.semester) : undefined
    });
    return normalizeCourse(res);
  },

  delete: async (id: number): Promise<boolean> => {
    return apiClient.delete("courses", id);
  }
};
