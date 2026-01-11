import { Controller, Get, Post, Patch, Delete, Body, Param, Query, HttpCode, HttpStatus, Inject } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiExtraModels } from "@nestjs/swagger";

import { UserService } from "@/domain/user/service";
import { NotFoundError } from "@/domain/exceptions";
import { pageToLimitOffset, createPaginatedResponse } from "@/presentation/pagination";
import { PaginatedUserResponseDto } from "./dto/paginated-user-response.dto";
import { ListUsersQueryDto } from "./dto/list-users-query.dto";
import { KyselyContext } from "@/infrastructure/db/kysely/context";
import { CreateUserDto } from "./dto/create-user.dto";
import { PatchUserDto } from "./dto/patch-user.dto";
import { UserResponseDto } from "./dto/user-response.dto";

@ApiTags("users")
@ApiExtraModels(CreateUserDto, PatchUserDto)
@Controller("users")
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService<KyselyContext>) {}

  @Get()
  @ApiOperation({ summary: "List users with pagination" })
  @ApiResponse({
    status: 200,
    description: "Paginated list of users",
    type: PaginatedUserResponseDto,
  })
  async listUsers(@Query() query: ListUsersQueryDto): Promise<PaginatedUserResponseDto> {
    const { page = 1, pageSize = 20 } = query;
    const [limit, offset] = pageToLimitOffset(page, pageSize);
    const [users, total] = await this.userService.listUsers(limit, offset);

    return createPaginatedResponse({
      items: users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        age: user.age,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      })),
      page,
      pageSize,
      total,
    });
  }

  @Post()
  @ApiOperation({ summary: "Create a new user" })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, type: () => UserResponseDto })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email, name, age } = createUserDto;
    const user = await this.userService.createUser(email, name, age ?? null);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      age: user.age,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  @Get(":userId")
  @ApiOperation({ summary: "Get a user by ID" })
  @ApiParam({ name: "userId", type: "string", format: "uuid" })
  @ApiResponse({ status: 200, type: () => UserResponseDto })
  @ApiResponse({ status: 404, description: "User not found" })
  async getUser(@Param("userId") userId: string): Promise<UserResponseDto> {
    const user = await this.userService.getUser(userId);

    if (!user) {
      throw new NotFoundError("User", userId);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      age: user.age,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  @Patch(":userId")
  @ApiOperation({ summary: "Partially update a user" })
  @ApiParam({ name: "userId", type: "string", format: "uuid" })
  @ApiBody({ type: PatchUserDto })
  @ApiResponse({ status: 200, type: () => UserResponseDto })
  @ApiResponse({ status: 404, description: "User not found" })
  async patchUser(@Param("userId") userId: string, @Body() patchUserDto: PatchUserDto): Promise<UserResponseDto> {
    const { email, name, age } = patchUserDto;

    const user = await this.userService.patchUser({
      userId,
      email,
      name,
      age,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      age: user.age,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  @Delete(":userId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a user" })
  @ApiParam({ name: "userId", type: "string", format: "uuid" })
  @ApiResponse({ status: 204, description: "User deleted" })
  @ApiResponse({ status: 404, description: "User not found" })
  async deleteUser(@Param("userId") userId: string): Promise<void> {
    await this.userService.deleteUser(userId);
  }
}
