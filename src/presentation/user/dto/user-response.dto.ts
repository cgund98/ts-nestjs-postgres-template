import { z } from "zod";
import { createZodDto } from "nestjs-zod";

export const userResponseSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
  age: z.number().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export class UserResponseDto extends createZodDto(userResponseSchema) {}
