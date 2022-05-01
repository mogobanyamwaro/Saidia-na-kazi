import { UnauthorizedException } from '@nestjs/common';

export class AccessTokenExpiredException extends UnauthorizedException {
  constructor() {
    super({
      errorType: 'AccessTokenExpired',
      message: 'Access token expired',
    });
  }
}
