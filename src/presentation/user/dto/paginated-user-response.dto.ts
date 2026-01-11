import { createPaginatedResponseSchema } from "@/presentation/pagination";
import { createZodDto } from "nestjs-zod";
import { userResponseSchema } from "./user-response.dto";

const listUsersResponseSchema = createPaginatedResponseSchema(userResponseSchema);

export class PaginatedUserResponseDto extends createZodDto(listUsersResponseSchema) {}
