import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { User } from '../users';

@Entity('access_token')
export class AccessToken extends BaseEntity {
  @ManyToOne((type) => User, (user) => user.accessTokens)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    name: 'token',
    unique: true,
  })
  token: string;

  @Column({
    name: 'user_id',
  })
  userId: string;

  @Column({
    name: 'expires_at',
  })
  expiresAt: Date;

  @Column({
    name: 'revoked',
    type: 'bool',
    default: false,
  })
  revoked: boolean;
}
