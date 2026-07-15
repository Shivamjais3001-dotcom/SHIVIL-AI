import { StudentRepository } from "../repositories/student.repository";
import { ApiError } from "../utils/api-error";
import { PaginationParams, buildPaginatedMeta } from "../utils/pagination";

const studentRepository = new StudentRepository();

export class StudentService {
  async getStudents(
    params: PaginationParams & { branch?: string; semester?: string; universityId?: string | null }
  ) {
    const { total, data } = await studentRepository.findAndCount(params);
    const meta = buildPaginatedMeta(total, params);
    return { data, meta };
  }

  async getStudentById(id: string, universityId?: string | null) {
    const student = await studentRepository.findById(id, universityId);
    if (!student) {
      throw ApiError.notFound("Student record not found or access unauthorized.");
    }
    return student;
  }

  async createStudent(data: {
    userId: string;
    rollNo: string;
    name: string;
    branch: string;
    semester: string;
    academicYear: string;
    parentName?: string;
    parentContact?: string;
    photoUrl?: string;
  }) {
    const existing = await studentRepository.findByRoll(data.rollNo);
    if (existing) {
      throw ApiError.conflict("A student record with this roll number already exists.");
    }

    return studentRepository.create(data);
  }

  async updateStudent(
    id: string,
    universityId: string | null,
    data: {
      name?: string;
      branch?: string;
      semester?: string;
      academicYear?: string;
      status?: string;
      parentName?: string;
      parentContact?: string;
      photoUrl?: string;
    }
  ) {
    // Validate existence and tenant ownership
    await this.getStudentById(id, universityId);
    return studentRepository.update(id, data);
  }

  async deleteStudent(id: string, universityId: string | null) {
    // Validate existence and tenant ownership
    await this.getStudentById(id, universityId);
    return studentRepository.delete(id);
  }
}
