export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export class PaginationHelper {
  public static DEFAULT_PAGE = 1;
  public static DEFAULT_LIMIT = 20;
  public static MAX_LIMIT = 100;

  public static parseOptions(options?: PaginationOptions): { page: number; limit: number; skip: number } {
    const page = Math.max(1, Number(options?.page) || this.DEFAULT_PAGE);
    const rawLimit = Number(options?.limit) || this.DEFAULT_LIMIT;
    const limit = Math.min(Math.max(1, rawLimit), this.MAX_LIMIT);
    const skip = (page - 1) * limit;

    return { page, limit, skip };
  }

  public static createMeta(total: number, page: number, limit: number): PaginationMeta {
    const totalPages = Math.ceil(total / limit) || 1;
    return {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }
}
