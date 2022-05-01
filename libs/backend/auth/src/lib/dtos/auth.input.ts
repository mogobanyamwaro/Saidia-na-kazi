/* eslint-disable @nrwl/nx/enforce-module-boundaries */

import { UserRoles } from '@saidia-na-kazi/backend/enum';
import { Exists, IsUnique } from '@saidia-na-kazi/backend/shared';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  Validate,
} from 'class-validator';

export class LoginInput {
  @ApiProperty({
    description: "User's email or Username",
  })
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  @Validate(Exists, [{ table: 'users', column: 'email' }])
  email?: string;

  @ApiProperty({
    description: "User's phone",
    example: '+923335555555',
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  @IsOptional()
  @Validate(Exists, [{ table: 'profiles', column: 'phone' }])
  phone?: string;

  @ApiProperty({
    description: "User's password",
  })
  @IsNotEmpty()
  password: string;
}

export class RegisterUserInput {
  @ApiProperty({
    description: "User's email",
  })
  @IsEmail()
  @Validate(IsUnique, [{ table: 'users', column: 'email' }])
  email: string;

  @ApiProperty({
    description: "User's firstName",
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: "User's lastName",
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: "User's username",
  })
  @IsOptional()
  @IsNotEmpty()
  @Validate(IsUnique, [{ table: 'users', column: 'username' }])
  username?: string;

  @ApiProperty({
    description: "User's phone",
  })
  @IsPhoneNumber()
  @IsOptional()
  @Validate(IsUnique, [{ table: 'profiles', column: 'phone' }])
  phone?: string;

  @ApiProperty({
    description: "User's password",
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: "User's role",
  })
  @IsEnum(UserRoles, {
    message: `Role must be one of the following: ${Object.keys(UserRoles)}`,
  })
  @IsNotEmpty()
  role: UserRoles;
}

export class VerifyEmailInput {
  @ApiProperty({
    description: "User's email",
  })
  @IsNotEmpty()
  @IsString()
  @Validate(Exists, [{ table: 'users', column: 'email_verification_token' }])
  @IsOptional()
  token: string;
}
