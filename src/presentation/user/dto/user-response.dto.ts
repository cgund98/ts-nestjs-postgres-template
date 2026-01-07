import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
  @ApiProperty({ type: String, example: "123e4567-e89b-12d3-a456-426614174000" })
  id!: string;

  @ApiProperty({ type: String, example: "user@example.com" })
  email!: string;

  @ApiProperty({ type: String, example: "John Doe" })
  name!: string;

  @ApiProperty({ type: Number, example: 30, nullable: true })
  age!: number | null;

  @ApiProperty({ type: String, example: "2024-01-01T00:00:00.000Z" })
  createdAt!: string;

  @ApiProperty({ type: String, example: "2024-01-01T00:00:00.000Z" })
  updatedAt!: string;
}
