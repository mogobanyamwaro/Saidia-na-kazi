import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class LoginInput {
  @ApiProperty({ description: "The user's email address." })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @Type(() => String)
  email?: string;

  @ApiProperty({
    description: "The user's phone number.",
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: "The user's password." })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  password: string;
}

export class ForgotPasswordInput {
  @ApiProperty({ description: "The user's email address." })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}

export class ResetPasswordInput {
  @ApiProperty({
    description: "The user's password reset token.",
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  token?: string;

  @ApiProperty({
    description: 'new password to be added',
  })
  password: string;
}
