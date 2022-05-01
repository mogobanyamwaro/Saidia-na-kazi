export {
  ForgotPasswordInput,
  LoginInput,
  ResetPasswordInput,
} from '@saidia-na-kazi/backend/dtos';

import { compareSync } from 'bcrypt';

import { UsersService } from '@saidia-na-kazi/backend/users';
import { ModuleRef } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ALREADY_REGISTERED_ERROR } from './constants';

import {
  LoginInput,
  RegisterUserInput,
  VerifyEmailInput,
} from './dtos/auth.input';
import {
  AccessToken,
  RefreshToken,
  User,
} from '@saidia-na-kazi/backend/entities';
import { getRepository, Repository } from 'typeorm';
import { addDays, addHours } from 'date-fns';
import { UserStatus } from '@saidia-na-kazi/backend/enum';
import {
  HttpStatus,
  OnModuleInit,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

export class AuthService implements OnModuleInit {
  private userService: UsersService;
  constructor(
    private readonly jwtService: JwtService,
    private moduleRef: ModuleRef,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
    @InjectRepository(AccessToken)
    private readonly accessTokenRepo: Repository<AccessToken>
  ) {}

  onModuleInit() {
    this.userService = this.moduleRef.get(UsersService, { strict: false });
  }

  async createUser(input: RegisterUserInput) {
    const { email, password, role, phone, ...rest } = input;
    const user = await this.userService.createUser({
      email,
      password,
      phone,
      role,
      firstName: rest.firstName,
      lastName: rest.lastName,
    });
    return {
      code: HttpStatus.OK,
      message: 'User Created Successfully',
      timestamp: new Date().toLocaleDateString(),
      user,
    };
  }

  async getUser(id: string) {
    return await this.userService.findById(id);
  }

  async login(input: LoginInput) {
    const { email, phone, password } = input;
    const username = email || phone;

    const user = await this.userService.findOneByEmailOrPhone(username);
    console.log(user);

    if (!user) {
      return {
        code: HttpStatus.NOT_FOUND,
        message: 'User not found',
      };
    }
    const isPasswordValid = compareSync(password, user.password);

    if (!isPasswordValid) {
      return {
        code: HttpStatus.UNAUTHORIZED,
        message: 'Invalid Password',
      };
    }

    if (process.env.NODE_ENV === 'production') {
      if (user.status !== UserStatus.ACTIVE) {
        return {
          code: HttpStatus.UNAUTHORIZED,
          message: 'Please Verify you account!',
        };
      }
    }
    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
      username: user.profile?.username,
      role: user.role,
      status: user.status,
    });

    const refreshToken = await this.jwtService.signAsync(
      {
        id: user.id,
        email: user.email,
        username: user.profile?.username,
        role: user.role,
        status: user.status,
      },

      { secret: process.env.JWT_REFRESH_TOKEN_SECRET }
    );
    return this.saveTokens(user, refreshToken, accessToken);
  }
  async saveTokens(user: User, refreshToken: string, accessToken: string) {
    const refresh = await this.refreshTokenRepo.save(
      this.refreshTokenRepo.create({
        user,
        token: refreshToken,
        expiresAt: addDays(new Date(), 7),
      })
    );

    const access = await this.accessTokenRepo.save(
      this.accessTokenRepo.create({
        user,
        token: accessToken,
        expiresAt: addHours(new Date(), 6),
      })
    );

    return {
      refreshToken: refresh.token,
      refreshTokenExpiresAt: refresh.expiresAt,
      accessToken: access.token,
      accessTokenExpiresAt: access.expiresAt,
    };
  }

  async checkEmail(email: string) {
    const user = await this.userService.findOneByEmailOrPhone(email);
    if (user) {
      throw new UnprocessableEntityException(ALREADY_REGISTERED_ERROR);
    }

    return {
      code: HttpStatus.OK,
      message: 'Email is available',
      timestamp: new Date().toLocaleDateString(),
    };
  }

  async verifyEmail(input: VerifyEmailInput) {
    const { token } = input;
    const isValid = await this.userService.findByEmailVerificationToken(token);
    if (!isValid) {
      return {
        code: HttpStatus.NOT_FOUND,
        message: 'Invalid Token',
      };
    }
    isValid.status = UserStatus.ACTIVE;
    isValid.emailVerifiedAt = new Date();

    await getRepository(User).save(isValid);
    return {
      code: HttpStatus.OK,
      message: 'Email Verified Successfully',
      timestamp: new Date().toLocaleDateString(),
    };
  }

  async refreshToken(request: Request) {
    //@ts-ignore
    const tokenData = request.cookies['refreshToken'];

    // * If the refreshToken object is not found
    if (!tokenData) {
      throw new UnauthorizedException();
    }

    const refreshToken = tokenData['value'];

    // * If the actual token value is not found
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const user = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    });

    const withRelations = await this.userService.findOneByEmailOrPhone(
      user.email
    );

    const refresh = await this.jwtService.signAsync(
      {
        id: withRelations.id,
        email: withRelations.email,
        username: withRelations.profile?.username,
        role: withRelations.role,
        status: withRelations.status,
      },
      { expiresIn: '7d', secret: process.env.JWT_REFRESH_TOKEN_SECRET }
    );

    const access = await this.jwtService.signAsync(
      {
        id: withRelations.id,
        email: withRelations.email,
        username: withRelations.profile?.username,
        role: withRelations.role,
        status: withRelations.status,
      },
      { expiresIn: '6h', secret: process.env.JWT_SECRET }
    );

    return this.saveTokens(user, refresh, access);
  }
}
