import prisma from "../config/database";

export class FacultyRepository {
  async findById(id: string, universityId?: string | null) {
    const whereClause: any = { id, deletedAt: null };
    if (universityId) {
      whereClause.user = { universityId };
    }

    return prisma.faculty.findFirst({
      where: whereClause,
      include: {
        user: {
          select: { email: true, role: true, universityId: true }
        }
      }
    });
  }

  async findAndCount(params: {
    page: number;
    limit: number;
    sort: string;
    order: "asc" | "desc";
    search: string;
    department?: string;
    universityId?: string | null;
  }) {
    const whereClause: any = { deletedAt: null };

    if (params.department) {
      whereClause.department = params.department;
    }

    if (params.universityId) {
      whereClause.user = { universityId: params.universityId };
    }

    if (params.search) {
      whereClause.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { department: { contains: params.search, mode: "insensitive" } }
      ];
    }

    const [total, data] = await prisma.$transaction([
      prisma.faculty.count({ where: whereClause }),
      prisma.faculty.findMany({
        where: whereClause,
        orderBy: { [params.sort]: params.order },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        include: {
          user: {
            select: { email: true, role: true, universityId: true }
          }
        }
      })
    ]);

    return { total, data };
  }

  async create(data: {
    userId: string;
    name: string;
    department: string;
    specialty?: string;
  }) {
    return prisma.faculty.create({
      data,
      include: {
        user: {
          select: { email: true, role: true, universityId: true }
        }
      }
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      department?: string;
      specialty?: string;
    }
  ) {
    return prisma.faculty.update({
      where: { id },
      data,
      include: {
        user: {
          select: { email: true, role: true, universityId: true }
        }
      }
    });
  }

  async delete(id: string) {
    return prisma.faculty.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}
