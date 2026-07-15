import prisma from "../config/database";

export class CourseRepository {
  async findById(id: string) {
    return prisma.course.findUnique({
      where: { id },
      include: { subjects: true }
    });
  }

  async findByCode(code: string) {
    return prisma.course.findUnique({
      where: { code }
    });
  }

  async findAndCount(params: {
    page: number;
    limit: number;
    sort: string;
    order: "asc" | "desc";
    search: string;
    semester?: string;
  }) {
    const whereClause: any = {};

    if (params.semester) {
      whereClause.semester = params.semester;
    }

    if (params.search) {
      whereClause.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { code: { contains: params.search, mode: "insensitive" } }
      ];
    }

    const [total, data] = await prisma.$transaction([
      prisma.course.count({ where: whereClause }),
      prisma.course.findMany({
        where: whereClause,
        orderBy: { [params.sort]: params.order },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        include: { subjects: true }
      })
    ]);

    return { total, data };
  }

  async create(data: { code: string; name: string; credits?: number; semester: string }) {
    return prisma.course.create({
      data: {
        code: data.code,
        name: data.name,
        credits: data.credits || 3,
        semester: data.semester
      }
    });
  }

  async update(id: string, data: { code?: string; name?: string; credits?: number; semester?: string }) {
    return prisma.course.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return prisma.course.delete({
      where: { id }
    });
  }
}
