import { Field, ID, InterfaceType } from 'type-graphql';
import { Column, CreateDateColumn, Index, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

import { School } from '../models/GeneralAdministrator/School';

@InterfaceType()
export abstract class IModelSchoolData {
  @Field(() => ID)
  @ObjectIdColumn()
  id!: string;

  @Index("index_schoolId")
  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  schoolId?: string;

  @Field(() => School, { nullable: true })
  school?: School;

  @Field({ nullable: true })
  @Column({ nullable: true })
  active?: boolean;

  @Field({ nullable: true })
  @Column({ type: 'number', default: 0 })
  version!: number;

  @Field({ nullable: true })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @Field({ nullable: true })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  createdByUserId?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  updatedByUserId?: string;
}
