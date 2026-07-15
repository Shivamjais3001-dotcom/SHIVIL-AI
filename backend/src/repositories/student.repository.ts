import prisma from "../config/database";

export class StudentRepository {
  async findById(id: string) {
    return prisma.student.findFirst({
      where: { id, deletedAt: null },
      include: {
        user: {
          select: { email: true, role: true }
        }
      }
    });
  }

  async findByRoll(rollNo: string) {
    return prisma.student.findFirst({
      where: { rollNo, deletedAt: null }
    });
  }

  async findAll(filters: { search?: string; branch?: string; semester?: string }) {
    const whereClause: any = { deletedAt: null };

    if (filters.branch) {
      whereClause.branch = filters.branch;
    }

    if (filters.semester) {
      whereClause.semester = filters.semester;
    }

    if (filters.search) {
      whereClause.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { rollNo: { contains: filters.search, mode: "insensitive" } }
      ];
    }

    return prisma.student.findMany({
      where: whereClause,
      orderBy: { rollNo: "asc" }
    });
  }

  async create(data: {
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
    return prisma.student.create({
      data
    });
  }

  async update(
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
    return prisma.student.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return prisma.student.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}
