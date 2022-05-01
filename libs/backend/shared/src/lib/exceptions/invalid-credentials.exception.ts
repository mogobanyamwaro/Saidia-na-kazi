import { UnauthorizedException } from '@nestjs/common';

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super({
      errorType: 'InvalidCredentials',
      message: 'Invalid credentials',
    });
  }
}
