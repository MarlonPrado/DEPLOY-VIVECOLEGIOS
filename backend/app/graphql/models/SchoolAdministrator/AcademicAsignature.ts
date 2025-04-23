import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { IModelSchoolData } from '../../interfaces/IModelSchoolData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { GeneralAcademicAsignature } from '../GeneralAdministrator/GeneralAcademicAsignature';
import { AcademicArea } from './AcademicArea';
import { AcademicGrade } from './AcademicGrade';
import { SchoolYear } from './SchoolYear';

@Index("index_full", ["academicAreaId", "academicGradeId", "generalAcademicAsignatureId", "schoolId", "schoolYearId"])
@ObjectType({ description: 'The AcademicAsignature model', implements: IModelSchoolData })
@Entity()
export class AcademicAsignature extends IModelSchoolData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  abbreviation?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  minWeight?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  maxWeight?: number;

  @Index("index_academicAreaId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  academicAreaId?: string;

  @Field({ nullable: true })
  academicArea?: AcademicArea;

  @Index("index_academicGradeId")
  @Field(() => [String], { nullable: true })
  @Column({ nullable: true })
  academicGradeId?: [string];

  @Field(() => [AcademicGrade], { nullable: true })
  academicGrade?: [AcademicGrade];

  @Index("index_generalAcademicAsignatureId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  generalAcademicAsignatureId?: string;

  @Field({ nullable: true })
  generalAcademicAsignature?: GeneralAcademicAsignature;

  @Field({ nullable: true })
  @Column({ nullable: true })
  order?: number;

  @Index("index_schoolYearId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  schoolYearId?: string;

  @Field({ nullable: true })
  schoolYear?: SchoolYear;

  @Field({ nullable: true })
  @Column({ nullable: true })
  entityBaseId?: string;
}

@ObjectType()
export class AcademicAsignatureEdge extends EdgeType('AcademicAsignature', AcademicAsignature) { }

@ObjectType()
export class AcademicAsignatureConnection extends ConnectionType<AcademicAsignatureEdge>(
  'AcademicAsignature',
  AcademicAsignatureEdge
) { }
