import { z } from "zod";
import { createZodDto } from "nestjs-zod";

/**
 * Zod schema for patching a user.
 * All fields are optional, but at least one must be provided.
 */
export const patchUserSchema = z
  .object({
    email: z.email("email must be a valid email address").optional(),
    name: z
      .string()
      .min(1, "name must be at least 1 character")
      .max(255, "name must not exceed 255 characters")
      .optional(),
    age: z
      .number()
      .int("age must be an integer")
      .min(0, "age must be at least 0")
      .max(125, "age must not exceed 125")
      .nullable()
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

/**
 * DTO class generated from Zod schema.
 * Provides validation and Swagger documentation.
 */
export class PatchUserDto extends createZodDto(patchUserSchema) {}
