import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '@saidia-na-kazi/backend/users';
import {
  DisabledUserException,
  InvalidCredentialsException,
  JwtPayload,
} from '@saidia-na-kazi/backend/shared';
import { UserStatus } from '@saidia-na-kazi/backend/enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findOneByEmailOrPhone(payload.email);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new DisabledUserException();
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new DisabledUserException();
    }

    if (user.status === UserStatus.BLOCKED) {
      throw new DisabledUserException();
    }

    return user;
  }
}
