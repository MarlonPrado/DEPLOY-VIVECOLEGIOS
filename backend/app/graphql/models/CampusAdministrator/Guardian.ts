import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';
import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { Campus } from '../GeneralAdministrator/Campus';
import { School } from '../GeneralAdministrator/School';
import { User } from '../GeneralAdministrator/User';

@Index("index_full_school", ["schoolId", "userId"])
@Index("index_full_campus", ["campusId", "userId"])
@Index("index_full_students", ["userId", "studentsId"])
@ObjectType({ description: 'The Guardian model', implements: IModelData })
@Entity()
export class Guardian extends IModelData {
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
  user?: User;

  @Index("index_studentsId")
  @Field(() => [String], { nullable: true })
  @Column({ nullable: true })
  studentsId?: String[];
}

@ObjectType()
export class GuardianEdge extends EdgeType('Guardian', Guardian) { }

@ObjectType()
export class GuardianConnection extends ConnectionType<GuardianEdge>('Guardian', GuardianEdge) { }
