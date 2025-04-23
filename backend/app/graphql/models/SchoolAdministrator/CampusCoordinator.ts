import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';
import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { School } from '../GeneralAdministrator/School';
import { User } from '../GeneralAdministrator/User';
import { Campus } from './../GeneralAdministrator/Campus';

@Index("index_full_school", ["schoolId", "userId"])
@Index("index_full_campus", ["campusId", "userId"])
@ObjectType({ description: 'The CampusCoordinator model', implements: IModelData })
@Entity()
export class CampusCoordinator extends IModelData {
  @Index("index_schoolId")
  @Field(() => [String], { nullable: true })
  @Column({ nullable: true })
  schoolId?: string[];

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
  user?: User;
}

@ObjectType()
export class CampusCoordinatorEdge extends EdgeType('CampusCoordinator', CampusCoordinator) { }

@ObjectType()
export class CampusCoordinatorConnection extends ConnectionType<CampusCoordinatorEdge>(
  'CampusCoordinator',
  CampusCoordinatorEdge
) { }
