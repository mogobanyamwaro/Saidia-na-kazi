import { User } from '@saidia-na-kazi/backend/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtPayload } from '../types/jwt-payload.type';
import { AccessTokenExpiredException } from '@saidia-na-kazi/backend/shared';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  public generateAuthToken(payload: JwtPayload) {}

  public generateRefreshToken(refreshToken: string) {
    const { id, username } = this.verifyToken(refreshToken, 'refresh');
  }

  public verifyToken(token: string, type?: string) {
    try {
      return this.jwtService.verify(token);
    } catch ({ name }) {
      if (name == 'TokenExpiredError' && type == 'refresh') {
        throw new AccessTokenExpiredException();
      }
    }
  }

  public async getUserByToken(token: string) {
    const { id } = this.verifyToken(token);
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
