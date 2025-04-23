import { Field, ObjectType } from 'type-graphql';
import { Column } from 'typeorm';

@ObjectType({ description: 'The SyncOfflineDescription model' })
export class SyncOfflineDescription {
  @Field({ nullable: true })
  @Column({ nullable: true })
  entity?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  offline?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  online?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  finish?: boolean;
}
