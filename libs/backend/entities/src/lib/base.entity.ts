import {
  Entity,
  BaseEntity as Base,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  PrimaryColumn,
} from 'typeorm';
import { v4 } from 'uuid';

@Entity()
export class BaseEntity extends Base {
  @PrimaryColumn('varchar', {
    length: 50,
  })
  id: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @BeforeInsert()
  addId() {
    this.id = v4();
  }
}
