export function pageToLimitOffset(page: number, pageSize: number): [number, number] {
  const limit = pageSize;
  const offset = (page - 1) * pageSize;
  return [limit, offset];
}

export interface CreatePaginatedResponseParams<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export function createPaginatedResponse<T>({
  items,
  page,
  pageSize,
  total,
}: CreatePaginatedResponseParams<T>): PaginatedResponse<T> {
  const totalPages = total > 0 ? Math.ceil(total / pageSize) : 0;

  return {
    items,
    page,
    pageSize,
    total,
    totalPages,
  };
}
