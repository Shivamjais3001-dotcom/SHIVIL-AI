import { apiClient } from "./apiClient";

export interface AttendanceRecord {
  id: number;
  studentName: string;
  roll: string;
  course: string;
  status: "Present" | "Absent";
  date: string;
}

export const attendanceService = {
  getAll: async (): Promise<AttendanceRecord[]> => {
    return apiClient.get<AttendanceRecord[]>("attendance");
  },

  mark: async (record: Omit<AttendanceRecord, "id">): Promise<AttendanceRecord> => {
    return apiClient.post<AttendanceRecord>("attendance", record);
  }
};
