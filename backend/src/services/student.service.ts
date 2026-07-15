import { StudentRepository } from "../repositories/student.repository";
import { CustomError } from "../utils/custom-error";

const studentRepository = new StudentRepository();

export class StudentService {
  async getStudents(filters: { search?: string; branch?: string; semester?: string }) {
    return studentRepository.findAll(filters);
  }

  async getStudentById(id: string) {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw new CustomError("Student record not found.", 404);
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
      throw new CustomError("A student record with this roll number already exists.", 400);
    }

    return studentRepository.create(data);
  }

  async updateStudent(
    id: string,
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
    // Check existence
    await this.getStudentById(id);
    return studentRepository.update(id, data);
  }

  async deleteStudent(id: string) {
    await this.getStudentById(id);
    return studentRepository.delete(id);
  }
}
