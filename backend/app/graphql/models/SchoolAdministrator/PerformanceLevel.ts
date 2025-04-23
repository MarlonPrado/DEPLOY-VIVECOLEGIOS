import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { PerformanceLevelCategory } from '../../enums/PerformanceLevelCategory';
import { PerformanceLevelCategoryGrade } from '../../enums/PerformanceLevelCategoryGrade';
import { PerformanceLevelType } from '../../enums/PerformanceLevelType';
import { IModelSchoolData } from '../../interfaces/IModelSchoolData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { Campus } from '../GeneralAdministrator/Campus';
import { GeneralPerformanceLevel } from '../GeneralAdministrator/GeneralPerformanceLevel';
import { AcademicGrade } from './AcademicGrade';
import { SchoolYear } from './SchoolYear';

@Index("index_full_campusId", ["generalPerformanceLevelId", "campusId", "schoolId", "schoolYearId"])
@Index("index_full_academicGradesId", ["generalPerformanceLevelId", "academicGradesId", "schoolId", "schoolYearId"])
@ObjectType({ description: 'The PerformanceLevel model', implements: IModelSchoolData })
@Entity()
export class PerformanceLevel extends IModelSchoolData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  minimumScore?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  topScore?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  abbreviation?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  colorHex?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  isFinal?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  isRecovery?: boolean;

  @Field(() => PerformanceLevelType, { nullable: true })
  @Column({ nullable: true })
  type?: PerformanceLevelType;

  @Field(() => PerformanceLevelCategory, { nullable: true })
  @Column({ nullable: true })
  category?: PerformanceLevelCategory;

  @Field(() => PerformanceLevelCategoryGrade, { nullable: true })
  @Column({ nullable: true })
  categoryGrade?: PerformanceLevelCategoryGrade;

  @Index("index_generalPerformanceLevelId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  generalPerformanceLevelId?: string;

  @Field({ nullable: true })
  generalPerformanceLevel?: GeneralPerformanceLevel;

  @Index("index_campusId")
  @Field(() => [String], { nullable: true })
  @Column({ nullable: true })
  campusId?: String[];

  @Field(() => [Campus], { nullable: true })
  campus?: Campus[];

  @Index("index_academicGradesId")
  @Field(() => [String], { nullable: true })
  @Column({ nullable: true })
  academicGradesId?: String[];

  @Field(() => [AcademicGrade], { nullable: true })
  academicGrades?: AcademicGrade[];

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
export class PerformanceLevelEdge extends EdgeType('PerformanceLevel', PerformanceLevel) { }

@ObjectType()
export class PerformanceLevelConnection extends ConnectionType<PerformanceLevelEdge>(
  'PerformanceLevel',
  PerformanceLevelEdge
) { }
