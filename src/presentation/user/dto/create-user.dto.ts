import { z } from "zod";
import { createZodDto } from "nestjs-zod";

/**
 * Zod schema for creating a user.
 */
export const createUserSchema = z.object({
  email: z.email("email must be a valid email address").min(1, "email must not be empty"),
  name: z.string().min(1, "name must be at least 1 character").max(255, "name must not exceed 255 characters"),
  age: z
    .number()
    .int("age must be an integer")
    .min(0, "age must be at least 0")
    .max(125, "age must not exceed 125")
    .nullable()
    .optional(),
});

/**
 * DTO class generated from Zod schema.
 * Provides validation and Swagger documentation.
 */
export class CreateUserDto extends createZodDto(createUserSchema) {}
