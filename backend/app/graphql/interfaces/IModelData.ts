import { Field, ID, InterfaceType } from 'type-graphql';
import { Column, CreateDateColumn, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

@InterfaceType()
export abstract class IModelData {
  @Field(() => ID)
  @ObjectIdColumn()
  id!: string;

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
