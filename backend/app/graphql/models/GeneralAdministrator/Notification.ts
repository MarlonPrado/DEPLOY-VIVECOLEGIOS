import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Lazy } from '../../../types';
import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { User } from './User';

@ObjectType({ description: 'The Notification model', implements: IModelData })
@Entity()
export class Notification extends IModelData {
  @ManyToOne(() => User, (data) => data.id, { lazy: true })
  @Field(() => User, { nullable: true })
  user?: Lazy<User>;

  @Field({ nullable: true })
  @Column({ nullable: true })
  userId?: string;

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
export class NotificationEdge extends EdgeType('Notification', Notification) { }

@ObjectType()
export class NotificationConnection extends ConnectionType<NotificationEdge>(
  'Notification',
  NotificationEdge
) { }
