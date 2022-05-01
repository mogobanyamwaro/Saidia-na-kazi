import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';

import {
  Profile,
  ProfileDocument,
  User,
} from '@saidia-na-kazi/backend/entities';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, ProfileDocument]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class BackendUsersModule {}
