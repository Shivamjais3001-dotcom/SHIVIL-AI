import prisma from "../config/database";

export class DepartmentRepository {
  async findById(id: string) {
    return prisma.department.findUnique({
      where: { id }
    });
  }

  async findByCode(code: string) {
    return prisma.department.findUnique({
      where: { code }
    });
  }

  async findAndCount(params: {
    page: number;
    limit: number;
    sort: string;
    order: "asc" | "desc";
    search: string;
  }) {
    const whereClause: any = {};

    if (params.search) {
      whereClause.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { code: { contains: params.search, mode: "insensitive" } }
      ];
    }

    const [total, data] = await prisma.$transaction([
      prisma.department.count({ where: whereClause }),
      prisma.department.findMany({
        where: whereClause,
        orderBy: { [params.sort]: params.order },
        skip: (params.page - 1) * params.limit,
        take: params.limit
      })
    ]);

    return { total, data };
  }

  async create(data: { name: string; code: string }) {
    return prisma.department.create({
      data
    });
  }

  async update(id: string, data: { name?: string; code?: string }) {
    return prisma.department.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return prisma.department.delete({
      where: { id }
    });
  }
}
