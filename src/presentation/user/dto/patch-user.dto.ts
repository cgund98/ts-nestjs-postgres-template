import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  IsInt,
  Min,
  ValidateIf,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

// Custom validator to ensure value is actually a string type
function IsStringType(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isStringType",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions ?? {},
      validator: {
        validate(value: any) {
          return typeof value === "string";
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a string`;
        },
      },
    });
  };
}

export class PatchUserDto {
  @ApiProperty({ type: String, example: "user@example.com", required: false })
  @ValidateIf((o) => o.email !== undefined)
  @IsStringType({ message: "email must be a string" })
  @IsString({ message: "email must be a string" })
  @IsEmail({}, { message: "email must be a valid email address" })
  email?: string;

  @ApiProperty({ type: String, example: "John Doe", required: false })
  @ValidateIf((o) => o.name !== undefined)
  @IsStringType({ message: "name must be a string" })
  @IsString({ message: "name must be a string" })
  @MinLength(1, { message: "name must be at least 1 character" })
  @MaxLength(255, { message: "name must not exceed 255 characters" })
  name?: string;

  @ApiProperty({ type: Number, example: 30, nullable: true, required: false })
  @ValidateIf((o) => o.age !== undefined)
  @IsNumber({}, { message: "age must be a number" })
  @IsInt({ message: "age must be an integer" })
  @Min(0, { message: "age must be at least 0" })
  age?: number | null;
}
