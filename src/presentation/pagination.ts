import { z } from "zod";

/**
 * Utility to convert page & pageSize to SQL-style limit/offset.
 */
export function pageToLimitOffset(page: number, pageSize: number): [number, number] {
  const limit = pageSize;
  const offset = (page - 1) * pageSize;
  return [limit, offset];
}

/**
 * Zod schema for paginated response of generic type T.
 */
export function createPaginatedResponseSchema<T extends z.ZodType>(
  itemSchema: T
): z.ZodObject<{
  items: z.ZodArray<T>;
  page: z.ZodNumber;
  pageSize: z.ZodNumber;
  total: z.ZodNumber;
  totalPages: z.ZodNumber;
}> {
  return z.object({
    items: z.array(itemSchema),
    page: z.number().int().min(1),
    pageSize: z.number().int().min(1),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(0),
  });
}

/**
 * Helper to create a paginated response shape, ensuring type safety.
 */
export function createPaginatedResponse<T>({
  items,
  page,
  pageSize,
  total,
}: {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}): {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
} {
  const totalPages = total > 0 ? Math.ceil(total / pageSize) : 0;

  return {
    items,
    page,
    pageSize,
    total,
    totalPages,
  };
}
