import { DepartmentRepository } from "../repositories/department.repository";
import { ApiError } from "../utils/api-error";
import { PaginationParams, buildPaginatedMeta } from "../utils/pagination";

const departmentRepository = new DepartmentRepository();

export class DepartmentService {
  async getDepartments(params: PaginationParams) {
    const { total, data } = await departmentRepository.findAndCount(params);
    const meta = buildPaginatedMeta(total, params);
    return { data, meta };
  }

  async getDepartmentById(id: string) {
    const dept = await departmentRepository.findById(id);
    if (!dept) {
      throw ApiError.notFound("Department not found.");
    }
    return dept;
  }

  async createDepartment(data: { name: string; code: string }) {
    const existing = await departmentRepository.findByCode(data.code);
    if (existing) {
      throw ApiError.conflict("A department with this code already exists.");
    }
    return departmentRepository.create(data);
  }

  async updateDepartment(id: string, data: { name?: string; code?: string }) {
    await this.getDepartmentById(id);
    if (data.code) {
      const existing = await departmentRepository.findByCode(data.code);
      if (existing && existing.id !== id) {
        throw ApiError.conflict("A department with this code already exists.");
      }
    }
    return departmentRepository.update(id, data);
  }

  async deleteDepartment(id: string) {
    await this.getDepartmentById(id);
    return departmentRepository.delete(id);
  }
}
