import { ApiProperty } from '@nestjs/swagger';
import {
  EmployeeEducationLevel,
  MaritalStatusType,
  UserProfileStatus,
} from '@saidia-na-kazi/backend/enum';
import { IsPhoneNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { ProfileDocument } from './profile-document.entity';
import { ProfilePhoto } from './profile-photo.entity';
import { UniqueSkills } from './unique-skills.entity';
import { User } from './user.entity';
@Entity('profile')
export class Profile extends BaseEntity {
  @ApiProperty({
    description: 'Username of the user',
  })
  @Column({
    name: 'username',
    unique: true,
    nullable: true,
  })
  username: string;

  @Column({
    name: 'contact_phone_number',
    nullable: true,
  })
  contactPhoneNumber?: string;

  @ApiProperty({
    description: 'User first name',
  })
  @Column({
    name: 'first_name',
    nullable: true,
  })
  firstName?: string;

  @ApiProperty({
    description: 'User last name',
  })
  @Column({
    name: 'last_name',
    nullable: true,
  })
  lastName?: string;

  @ApiProperty({
    description: 'User phone',
    type: String,
  })
  @IsPhoneNumber()
  @Column({
    name: 'phone',
    nullable: true,
  })
  phone?: string;

  @ApiProperty({
    description: 'User date of birth',
  })
  @Column({
    name: 'date_of_birth',
    nullable: true,
  })
  dateOfBirth?: Date;

  @ApiProperty({
    description: 'User avatar photo',
  })
  @IsString()
  @Column({
    name: 'avatar',
    nullable: true,
  })
  avatar?: string;

  @ApiProperty({
    description: 'User Marital Status',
  })
  @Column({
    name: 'marital_status',
    type: 'enum',
    enum: MaritalStatusType,
    nullable: true,
  })
  maritalStatus?: MaritalStatusType;

  @ApiProperty({
    description: 'Languages Spoken',
  })
  @Column({
    name: 'languages_spoken',
    type: 'varchar',
    nullable: true,
  })
  languagesSpoken: string;

  @ApiProperty({
    description: 'Residential location',
  })
  @IsString()
  @Column({
    name: 'residential_location',
    nullable: true,
  })
  residentialLocation: string;

  @ApiProperty({
    description: 'Employee Educational Qualification',
  })
  @Column({
    name: 'level_of_education',
    type: 'enum',
    enum: EmployeeEducationLevel,
    nullable: true,
  })
  levelOfEducation: EmployeeEducationLevel;

  @ApiProperty({
    description: 'Years of Experience',
  })
  @Column({
    name: 'years_of_experience',
    nullable: true,
  })
  yearsOfExperience: number;

  @ApiProperty({
    description: 'Profile Completion',
  })
  @Column({
    name: 'profile_completion',
    nullable: true,
  })
  profileCompletion: number;

  @ApiProperty({
    description: 'Driver Profile Status',
  })
  @Column({
    name: 'status',
    type: 'enum',
    enum: UserProfileStatus,
    nullable: true,
  })
  status: UserProfileStatus;

  @ApiProperty({
    description: 'User unique skills',
  })
  @OneToMany(() => UniqueSkills, (uniqueSkills) => uniqueSkills.profile, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'profile_id' })
  uniqueSkills?: UniqueSkills[];

  @ApiProperty({
    description: 'Profile documents',
  })
  @OneToMany(() => ProfileDocument, (documents) => documents.profile, {
    cascade: ['insert', 'remove', 'soft-remove', 'update'],
  })
  @JoinColumn({ name: 'profile_id' })
  documents: ProfileDocument[];

  @ApiProperty({
    description: 'Profile photos',
  })
  @OneToMany(() => ProfilePhoto, (photos) => photos.profile)
  @JoinColumn({ name: 'profile_id' })
  photos: ProfilePhoto[];

  @ApiProperty({
    description: 'User',
  })
  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
