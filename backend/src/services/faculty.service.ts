import { FacultyRepository } from "../repositories/faculty.repository";
import { ApiError } from "../utils/api-error";
import { PaginationParams, buildPaginatedMeta } from "../utils/pagination";

const facultyRepository = new FacultyRepository();

export class FacultyService {
  async getFaculty(
    params: PaginationParams & { department?: string; universityId?: string | null }
  ) {
    const { total, data } = await facultyRepository.findAndCount(params);
    const meta = buildPaginatedMeta(total, params);
    return { data, meta };
  }

  async getFacultyById(id: string, universityId?: string | null) {
    const faculty = await facultyRepository.findById(id, universityId);
    if (!faculty) {
      throw ApiError.notFound("Faculty profile not found or access unauthorized.");
    }
    return faculty;
  }

  async createFaculty(data: {
    userId: string;
    name: string;
    department: string;
    specialty?: string;
  }) {
    return facultyRepository.create(data);
  }

  async updateFaculty(
    id: string,
    universityId: string | null,
    data: {
      name?: string;
      department?: string;
      specialty?: string;
    }
  ) {
    await this.getFacultyById(id, universityId);
    return facultyRepository.update(id, data);
  }

  async deleteFaculty(id: string, universityId: string | null) {
    await this.getFacultyById(id, universityId);
    return facultyRepository.delete(id);
  }
}
