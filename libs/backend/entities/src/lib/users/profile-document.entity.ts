import { DocumentTypes } from '@saidia-na-kazi/backend/enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Profile } from './profile.entity';
@Entity('profile_documents')
export class ProfileDocument extends BaseEntity {
  @ManyToOne(() => Profile, (profile) => profile.documents)
  @JoinColumn({ name: 'user_id' })
  profile: Profile;

  @Column({
    name: 'document_type',
    type: 'enum',
    enum: DocumentTypes,
    nullable: true,
  })
  documentType: DocumentTypes;

  @Column({
    name: 'title',
    nullable: true,
  })
  title?: string;

  @Column({
    name: 'file_id',
  })
  fileId: string;

  @Column({
    name: 'is_verified',
    default: false,
  })
  isVerified: boolean;

  @Column({
    name: 'issue_date',
    nullable: true,
  })
  issueDate: Date;

  @Column({
    name: 'expiry_date',
    nullable: true,
  })
  expiryDate: Date;
}
