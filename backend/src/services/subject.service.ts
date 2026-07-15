import { SubjectRepository } from "../repositories/subject.repository";
import { ApiError } from "../utils/api-error";
import { PaginationParams, buildPaginatedMeta } from "../utils/pagination";

const subjectRepository = new SubjectRepository();

export class SubjectService {
  async getSubjects(params: PaginationParams & { courseId?: string; facultyId?: string }) {
    const { total, data } = await subjectRepository.findAndCount(params);
    const meta = buildPaginatedMeta(total, params);
    return { data, meta };
  }

  async getSubjectById(id: string) {
    const subject = await subjectRepository.findById(id);
    if (!subject) {
      throw ApiError.notFound("Subject not found.");
    }
    return subject;
  }

  async createSubject(data: { code: string; name: string; courseId: string; facultyId?: string }) {
    const existing = await subjectRepository.findByCode(data.code);
    if (existing) {
      throw ApiError.conflict("A subject with this code already exists.");
    }
    return subjectRepository.create(data);
  }

  async updateSubject(id: string, data: { code?: string; name?: string; courseId?: string; facultyId?: string }) {
    await this.getSubjectById(id);
    if (data.code) {
      const existing = await subjectRepository.findByCode(data.code);
      if (existing && existing.id !== id) {
        throw ApiError.conflict("A subject with this code already exists.");
      }
    }
    return subjectRepository.update(id, data);
  }

  async deleteSubject(id: string) {
    await this.getSubjectById(id);
    return subjectRepository.delete(id);
  }
}
