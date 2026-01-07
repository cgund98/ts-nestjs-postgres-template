import { z } from "zod";
import { createZodDto } from "nestjs-zod";

/**
 * Zod schema for listing users query parameters.
 * Uses coerce to convert string query params to numbers.
 */
export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).default(20).optional(),
});

/**
 * DTO class generated from Zod schema.
 * Provides validation and Swagger documentation.
 */
export class ListUsersQueryDto extends createZodDto(listUsersQuerySchema) {}
