import { UnauthorizedException } from '@nestjs/common';

export class DisabledUserException extends UnauthorizedException {
  constructor() {
    super({
      errorType: 'DisabledUser',
      message: 'User is not authorized to Login',
    });
  }
}
