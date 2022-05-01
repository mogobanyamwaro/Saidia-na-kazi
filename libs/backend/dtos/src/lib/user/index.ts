import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from '@saidia-na-kazi/backend/enum';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateUserInput {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The first name of the user',
  })
  firstName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The last name of the user',
  })
  lastName?: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The email of the user',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'The password of the user',
  })
  password: string;

  @IsPhoneNumber()
  @ApiProperty({
    description: "User's phone",
  })
  @IsOptional()
  phone?: string;

  @IsNotEmpty()
  @ApiProperty({ enum: Object.keys(UserRoles) })
  @IsEnum(UserRoles, {
    message: `Role type Must be one of the following: ${Object.keys(
      UserRoles
    ).join(', ')}`,
  })
  role: UserRoles;
}

export * from './auth.dto';
