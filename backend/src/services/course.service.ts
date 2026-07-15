import { CourseRepository } from "../repositories/course.repository";
import { ApiError } from "../utils/api-error";
import { PaginationParams, buildPaginatedMeta } from "../utils/pagination";

const courseRepository = new CourseRepository();

export class CourseService {
  async getCourses(params: PaginationParams & { semester?: string }) {
    const { total, data } = await courseRepository.findAndCount(params);
    const meta = buildPaginatedMeta(total, params);
    return { data, meta };
  }

  async getCourseById(id: string) {
    const course = await courseRepository.findById(id);
    if (!course) {
      throw ApiError.notFound("Course not found in catalog.");
    }
    return course;
  }

  async createCourse(data: { code: string; name: string; credits?: number; semester: string }) {
    const existing = await courseRepository.findByCode(data.code);
    if (existing) {
      throw ApiError.conflict("A course with this code already exists.");
    }
    return courseRepository.create(data);
  }

  async updateCourse(id: string, data: { code?: string; name?: string; credits?: number; semester?: string }) {
    await this.getCourseById(id);
    if (data.code) {
      const existing = await courseRepository.findByCode(data.code);
      if (existing && existing.id !== id) {
        throw ApiError.conflict("A course with this code already exists.");
      }
    }
    return courseRepository.update(id, data);
  }

  async deleteCourse(id: string) {
    await this.getCourseById(id);
    return courseRepository.delete(id);
  }
}
