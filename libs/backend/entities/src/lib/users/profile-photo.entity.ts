import { ApiProperty } from '@nestjs/swagger';
import { ProfilePhotoType } from '@saidia-na-kazi/backend/enum';
import { IsEnum, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Profile } from './profile.entity';

@Entity('profile_photos')
export class ProfilePhoto extends BaseEntity {
  @ApiProperty({
    description: 'Profile Photo fileUrl',
  })
  @IsString()
  @Column({
    name: 'file_url',
  })
  fileUrl: string;

  @ApiProperty({
    description: 'Profile Photo type',
  })
  @IsEnum(ProfilePhotoType)
  @Column({
    name: 'type',
    type: 'enum',
    enum: ProfilePhotoType,
  })
  type: ProfilePhotoType;

  @Column({
    name: 'is_verified',
    default: false,
  })
  isVerified: boolean;

  @ManyToOne(() => Profile, (profile) => profile.photos)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;
}
