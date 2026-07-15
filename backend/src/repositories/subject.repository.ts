import prisma from "../config/database";

export class SubjectRepository {
  async findById(id: string) {
    return prisma.subject.findUnique({
      where: { id },
      include: { course: true, faculty: true }
    });
  }

  async findByCode(code: string) {
    return prisma.subject.findUnique({
      where: { code }
    });
  }

  async findAndCount(params: {
    page: number;
    limit: number;
    sort: string;
    order: "asc" | "desc";
    search: string;
    courseId?: string;
    facultyId?: string;
  }) {
    const whereClause: any = {};

    if (params.courseId) {
      whereClause.courseId = params.courseId;
    }

    if (params.facultyId) {
      whereClause.facultyId = params.facultyId;
    }

    if (params.search) {
      whereClause.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { code: { contains: params.search, mode: "insensitive" } }
      ];
    }

    const [total, data] = await prisma.$transaction([
      prisma.subject.count({ where: whereClause }),
      prisma.subject.findMany({
        where: whereClause,
        orderBy: { [params.sort]: params.order },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        include: { course: true, faculty: true }
      })
    ]);

    return { total, data };
  }

  async create(data: { code: string; name: string; courseId: string; facultyId?: string }) {
    return prisma.subject.create({
      data,
      include: { course: true, faculty: true }
    });
  }

  async update(id: string, data: { code?: string; name?: string; courseId?: string; facultyId?: string }) {
    return prisma.subject.update({
      where: { id },
      data,
      include: { course: true, faculty: true }
    });
  }

  async delete(id: string) {
    return prisma.subject.delete({
      where: { id }
    });
  }
}
