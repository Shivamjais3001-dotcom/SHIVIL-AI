export interface PaginationParams {
  page: number;
  limit: number;
  sort: string;
  order: "asc" | "desc";
  search: string;
  cursor?: string;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total?: number;
  pages?: number;
  sort: string;
  order: "asc" | "desc";
  nextCursor?: string | null;
}

export function parsePaginationParams(query: any, defaultSort: string = "createdAt"): PaginationParams {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(query.limit as string) || 10));
  const sort = (query.sort as string) || defaultSort;
  const order = (query.order as string) === "desc" ? "desc" : "asc";
  const search = (query.search as string) || "";
  const cursor = (query.cursor as string) || undefined;
  
  return { page, limit, sort, order, search, cursor };
}

export function buildPaginatedMeta(
  total: number,
  params: PaginationParams,
  nextCursor?: string | null
): PaginatedMeta {
  const pages = Math.ceil(total / params.limit) || 1;
  return {
    page: params.page,
    limit: params.limit,
    total,
    pages,
    sort: params.sort,
    order: params.order,
    nextCursor
  };
}
