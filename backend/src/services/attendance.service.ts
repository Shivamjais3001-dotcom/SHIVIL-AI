import { AttendanceStatus } from "@prisma/client";
import { AttendanceRepository } from "../repositories/attendance.repository";
import { ApiError } from "../utils/api-error";
import { PaginationParams, buildPaginatedMeta } from "../utils/pagination";

const attendanceRepository = new AttendanceRepository();

export class AttendanceService {
  async getAttendance(
    params: PaginationParams & { studentId?: string; subjectId?: string; status?: AttendanceStatus; universityId?: string | null }
  ) {
    const { total, data, nextCursor } = await attendanceRepository.findAndCount(params);
    const meta = buildPaginatedMeta(total, params, nextCursor);
    return { data, meta };
  }

  async markAttendance(data: { date: string | Date; status: AttendanceStatus; studentId: string; subjectId: string }) {
    const parsedDate = new Date(data.date);
    if (isNaN(parsedDate.getTime())) {
      throw ApiError.badRequest("Invalid date format provided.");
    }
    return attendanceRepository.mark({
      date: parsedDate,
      status: data.status,
      studentId: data.studentId,
      subjectId: data.subjectId
    });
  }
}
