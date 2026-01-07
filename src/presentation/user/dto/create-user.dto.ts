import { IsEmail, IsString, MinLength, MaxLength, IsNumber, IsInt, Min, IsOptional, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ type: String, example: "user@example.com" })
  @IsNotEmpty({ message: "email must not be empty" })
  @IsString({ message: "email must be a string" })
  @IsEmail({}, { message: "email must be a valid email address" })
  email!: string;

  @ApiProperty({ type: String, example: "John Doe" })
  @IsNotEmpty({ message: "name must not be empty" })
  @IsString({ message: "name must be a string" })
  @MinLength(1, { message: "name must be at least 1 character" })
  @MaxLength(255, { message: "name must not exceed 255 characters" })
  name!: string;

  @ApiProperty({ type: Number, example: 30, nullable: true, required: false })
  @IsOptional()
  @IsNumber({}, { message: "age must be a number" })
  @IsInt({ message: "age must be an integer" })
  @Min(0, { message: "age must be at least 0" })
  age?: number | null;
}
