import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { IModelSchoolData } from '../../interfaces/IModelSchoolData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { GeneralAcademicArea } from '../GeneralAdministrator/GeneralAcademicArea';
import { AcademicGrade } from './AcademicGrade';
import { SchoolYear } from './SchoolYear';

@Index("index_full", ["generalAcademicAreaId", "academicGradeId", "schoolId", "schoolYearId"])
@ObjectType({ description: 'The AcademicArea model', implements: IModelSchoolData })
@Entity()
export class AcademicArea extends IModelSchoolData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  abbreviation?: string;

  @Index("index_generalAcademicAreaId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  generalAcademicAreaId?: string;

  @Field({ nullable: true })
  generalAcademicArea?: GeneralAcademicArea;

  @Index("index_academicGradeId")
  @Field(() => [String], { nullable: true })
  @Column({ nullable: true })
  academicGradeId?: [string];

  @Field(() => [AcademicGrade], { nullable: true })
  academicGrade?: [AcademicGrade];

  @Field({ nullable: true })
  @Column({ nullable: true })
  order?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  isAverage?: boolean;

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
export class AcademicAreaEdge extends EdgeType('AcademicArea', AcademicArea) { }

@ObjectType()
export class AcademicAreaConnection extends ConnectionType<AcademicAreaEdge>(
  'AcademicArea',
  AcademicAreaEdge
) { }
