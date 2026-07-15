import { TimetableRepository } from "../repositories/timetable.repository";
import { ApiError } from "../utils/api-error";
import { buildPaginatedMeta } from "../utils/pagination";

const timetableRepository = new TimetableRepository();

export class TimetableService {
  async getTimetable(
    params: {
      page: number;
      limit: number;
      dayOfWeek?: number;
      facultyId?: string;
      courseId?: string;
      universityId?: string | null;
    }
  ) {
    const { total, data } = await timetableRepository.findAndCount(params);
    const paginationParams = { page: params.page, limit: params.limit, sort: "dayOfWeek", order: "asc" as const, search: "" };
    const meta = buildPaginatedMeta(total, paginationParams);
    return { data, meta };
  }

  async getTimetableById(id: string) {
    const schedule = await timetableRepository.findById(id);
    if (!schedule) {
      throw ApiError.notFound("Timetable entry not found.");
    }
    return schedule;
  }

  async createTimetable(data: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    subjectId: string;
    facultyId: string;
  }) {
    // 1. Conflict Detection: check overlapping slots for faculty
    const conflict = await timetableRepository.findConflicts(
      data.dayOfWeek,
      data.startTime,
      data.endTime,
      data.facultyId
    );

    if (conflict) {
      throw ApiError.conflict(
        `Timetable conflict. Faculty is already assigned to a class from ${conflict.startTime} to ${conflict.endTime} on this day.`
      );
    }

    return timetableRepository.create(data);
  }

  async deleteTimetable(id: string) {
    await this.getTimetableById(id);
    return timetableRepository.delete(id);
  }
}
