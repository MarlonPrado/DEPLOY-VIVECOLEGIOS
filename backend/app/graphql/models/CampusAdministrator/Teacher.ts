import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { Campus } from '../GeneralAdministrator/Campus';
import { School } from '../GeneralAdministrator/School';
import { User } from '../GeneralAdministrator/User';
import { AcademicAsignature } from '../SchoolAdministrator/AcademicAsignature';
import { SchoolYear } from '../SchoolAdministrator/SchoolYear';

@Index("index_full_school", ["schoolId", "userId", "academicAsignatureId", "schoolYearId"])
@Index("index_full_campus", ["campusId", "userId", "academicAsignatureId", "schoolYearId"])
@ObjectType({ description: 'The Teacher model', implements: IModelData })
@Entity()
export class Teacher extends IModelData {
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

  @Index("index_academicAsignatureId")
  @Field(() => [String], { nullable: true })
  @Column({ nullable: true })
  academicAsignatureId?: string[];

  @Field(() => [AcademicAsignature], { nullable: true })
  academicAsignature?: AcademicAsignature[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  attentionSchedule?: string;

  @Index("index_schoolYearId")
  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  schoolYearId?: String;

  @Field(() => SchoolYear, { nullable: true })
  schoolYear?: SchoolYear;

  @Field({ nullable: true })
  @Column({ nullable: true })
  entityBaseId?: string;
}

@ObjectType()
export class TeacherEdge extends EdgeType('Teacher', Teacher) { }

@ObjectType()
export class TeacherConnection extends ConnectionType<TeacherEdge>('Teacher', TeacherEdge) { }
