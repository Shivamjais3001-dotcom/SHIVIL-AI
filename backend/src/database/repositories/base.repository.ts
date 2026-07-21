import { PrismaClient } from "@prisma/client";
import { prismaClient } from "../client/prisma.client";
import { PaginationHelper, PaginationOptions, PaginatedResult } from "../utils/pagination.util";
import { SoftDeleteHelper } from "../utils/soft-delete.util";

export abstract class BaseRepository<
  TModel,
  TCreateInput,
  TUpdateInput,
  TWhereUniqueInput,
  TWhereInput
> {
  protected constructor(
    protected readonly delegateName: string,
    protected readonly db: PrismaClient = prismaClient
  ) {}

  protected get delegate(): any {
    return (this.db as any)[this.delegateName];
  }

  public async findById(id: string): Promise<TModel | null> {
    return this.delegate.findUnique({
      where: SoftDeleteHelper.whereNotDeleted({ id }),
    });
  }

  public async findUnique(where: TWhereUniqueInput): Promise<TModel | null> {
    return this.delegate.findUnique({
      where: SoftDeleteHelper.whereNotDeleted(where as Record<string, any>),
    });
  }

  public async findMany(
    where?: TWhereInput,
    options?: PaginationOptions
  ): Promise<PaginatedResult<TModel>> {
    const { page, limit, skip } = PaginationHelper.parseOptions(options);
    const filter = SoftDeleteHelper.whereNotDeleted(where as Record<string, any>);

    const [data, total] = await Promise.all([
      this.delegate.findMany({
        where: filter,
        skip,
        take: limit,
        orderBy: options?.sortBy
          ? { [options.sortBy]: options.sortOrder || "desc" }
          : { createdAt: "desc" },
      }),
      this.delegate.count({ where: filter }),
    ]);

    return {
      data,
      meta: PaginationHelper.createMeta(total, page, limit),
    };
  }

  public async create(data: TCreateInput): Promise<TModel> {
    return this.delegate.create({
      data,
    });
  }

  public async update(id: string, data: TUpdateInput): Promise<TModel> {
    return this.delegate.update({
      where: { id },
      data,
    });
  }

  public async softDelete(id: string): Promise<TModel> {
    return this.delegate.update({
      where: { id },
      data: SoftDeleteHelper.softDeletePayload(),
    });
  }

  public async restore(id: string): Promise<TModel> {
    return this.delegate.update({
      where: { id },
      data: SoftDeleteHelper.restorePayload(),
    });
  }

  public async hardDelete(id: string): Promise<TModel> {
    return this.delegate.delete({
      where: { id },
    });
  }

  public async count(where?: TWhereInput): Promise<number> {
    const filter = SoftDeleteHelper.whereNotDeleted(where as Record<string, any>);
    return this.delegate.count({ where: filter });
  }
}
