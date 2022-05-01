import { UserRoles, UserStatus } from '@saidia-na-kazi/backend/enum';
import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '../base.entity';
import { JwtService } from '@nestjs/jwt';
import { Profile } from './profile.entity';
import { AccessToken, Attempt, RefreshToken } from '../auth';

@Entity('users')
export class User extends BaseEntity {
  @IsEmail()
  @Column({
    name: 'email',
    unique: true,
  })
  email: string;

  @Exclude()
  @Column({
    name: 'password',
  })
  password: string;

  @Column({
    name: 'is_admin',
    default: false,
  })
  isAdmin: boolean;

  @Exclude()
  @Column({
    name: 'email_verification_token',
    unique: true,
  })
  emailVerificationToken: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.EMPLOYEE,
  })
  role: UserRoles;

  @Column({
    name: 'is_live',
    default: false,
  })
  isLive: boolean;

  @Column({
    name: 'email_verified_at',
    default: null,
  })
  emailVerifiedAt: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.REVIEW,
  })
  status: UserStatus;

  @OneToOne(() => Profile, (profile) => profile.user, {
    eager: true,
    cascade: ['insert', 'remove', 'soft-remove', 'update'],
  })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @OneToMany(() => Attempt, (attempts) => attempts.user)
  @JoinColumn({ name: 'user_id' })
  attempts: Attempt[];

  @OneToMany(() => RefreshToken, (refreshTokens) => refreshTokens.user)
  @JoinColumn({ name: 'user_id' })
  refreshTokens: RefreshToken[];

  @OneToMany(() => AccessToken, (accessTokens) => accessTokens.user)
  @JoinColumn({ name: 'user_id' })
  accessTokens: AccessToken[];

  @BeforeInsert()
  generateEmailVerificationToken(): void {
    if (this.email) {
      const service = new JwtService({
        secret: process.env.JWT_SECRET,
      });
      this.emailVerificationToken = service.sign({
        email: this.email,
      });
    }
  }
  canModify() {
    return this.isAdmin || this.id;
  }

  isVerified() {
    return this.status === UserStatus.ACTIVE && this.emailVerifiedAt !== null;
  }
  constructor(user?: Partial<User>) {
    super();
    Object.assign(this, user);
  }
}
