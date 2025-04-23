import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';
import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { User } from './User';

@ObjectType({ description: 'The AuditLogin model', implements: IModelData })
@Entity()
export class AuditLogin extends IModelData {
  @Field({ nullable: true })
  user?: User;

  @Index("index_userId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  ip?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  geo?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  browser?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  language?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  ipware?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  ipwarePublic?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  auth?: Boolean;
}

@ObjectType()
export class AuditLoginEdge extends EdgeType('AuditLogin', AuditLogin) { }

@ObjectType()
export class AuditLoginConnection extends ConnectionType<AuditLoginEdge>(
  'AuditLogin',
  AuditLoginEdge
) { }
