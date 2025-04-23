import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { Campus } from './Campus';
import { School } from './School';
import { User } from './User';

@Index("index_full_school", ["schoolId", "userId"])
@Index("index_full_campus", ["campusId", "userId"])
@ObjectType({ description: 'The SchoolAdministrator model', implements: IModelData })
@Entity()
export class SchoolAdministrator extends IModelData {
  @Index("index_schoolId")
  @Field(() => [String], { nullable: true })
  @Column({ nullable: true })
  schoolId?: String[];

  @Field(() => [School], { nullable: true })
  school?: School[];

  @Index("index_campusId")
  @Field(() => [String], { nullable: true })
  @Column({ nullable: true })
  campusId?: String[];

  @Field(() => [Campus], { nullable: true })
  campus?: Campus[];

  @Index("index_userId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  user?: User;

  @Field({ nullable: true })
  @Column({ nullable: true })
  support?: boolean;
}

@ObjectType()
export class SchoolAdministratorEdge extends EdgeType('SchoolAdministrator', SchoolAdministrator) { }

@ObjectType()
export class SchoolAdministratorConnection extends ConnectionType<SchoolAdministratorEdge>(
  'SchoolAdministrator',
  SchoolAdministratorEdge
) { }
