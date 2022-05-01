import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Profile } from './profile.entity';

@Entity('unique_skills')
export class UniqueSkills extends BaseEntity {
  @ApiProperty({
    description: 'Skil Name',
  })
  @IsString()
  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;

  @ApiProperty({
    description: 'Skil is verfied',
  })
  @IsBoolean()
  @IsOptional()
  @Column({
    name: 'is_verified',
    default: false,
  })
  isVerified?: boolean;
  @ManyToOne(() => Profile, (profile) => profile.uniqueSkills)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;
}
