import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Lazy } from '../../../types';
import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { User } from './User';

@ObjectType({ description: 'The Inbox model', implements: IModelData })
@Entity()
export class Inbox extends IModelData {
  @ManyToOne(() => User, (data) => data.id, { lazy: true })
  @Field(() => User, { nullable: true })
  user?: Lazy<User>;

  @Field({ nullable: true })
  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => User, (data) => data.id, { lazy: true })
  @Field(() => User, { nullable: true })
  from?: Lazy<User>;

  @Field({ nullable: true })
  @Column({ nullable: true })
  fromId?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  dateSend?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  dateRead?: Date;
}

@ObjectType()
export class InboxEdge extends EdgeType('Inbox', Inbox) { }

@ObjectType()
export class InboxConnection extends ConnectionType<InboxEdge>('Inbox', InboxEdge) { }
