import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Lazy } from '../../../types';
import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { User } from './User';

@ObjectType({ description: 'The Email model', implements: IModelData })
@Entity()
export class Email extends IModelData {
  @ManyToOne(() => User, (data) => data.id, { lazy: true })
  @Field(() => User, { nullable: true })
  to?: Lazy<User>;

  @Field({ nullable: true })
  @Column({ nullable: true })
  toId?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  dateSend?: Date;
}

@ObjectType()
export class EmailEdge extends EdgeType('Email', Email) {}

@ObjectType()
export class EmailConnection extends ConnectionType<EmailEdge>('Email', EmailEdge) {}
