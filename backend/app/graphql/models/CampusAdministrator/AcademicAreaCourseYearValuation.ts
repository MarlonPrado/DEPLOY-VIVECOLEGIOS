import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';
import { ValuationType } from '../../enums/ValuationType';

import { IModelCampusData } from '../../interfaces/IModelCampusData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { Student } from '../GeneralAdministrator/Student';
import { AcademicArea } from '../SchoolAdministrator/AcademicArea';
import { PerformanceLevel } from '../SchoolAdministrator/PerformanceLevel';
import { SchoolYear } from '../SchoolAdministrator/SchoolYear';

@Index("index_full", ["academicAreaId", "schoolYearId", "studentId", "campusId"])
@ObjectType({ description: 'The AcademicAreaCourseYearValuation model', implements: IModelCampusData })
@Entity()
export class AcademicAreaCourseYearValuation extends IModelCampusData {

  @Index("index_academicAreaId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  academicAreaId?: string;

  @Field({ nullable: true })
  academicArea?: AcademicArea;

  @Index("index_schoolYearId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  schoolYearId?: string;

  @Field({ nullable: true })
  schoolYear?: SchoolYear;

  @Index("index_studentId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  studentId?: String;

  @Field({ nullable: true })
  student?: Student;

  @Field({ nullable: true })
  @Column({ nullable: true })
  assessment?: number;

  @Index("index_performanceLevelId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  performanceLevelId?: String;

  @Field(() => PerformanceLevel, { nullable: true })
  performanceLevel?: PerformanceLevel;

  @Field(() => ValuationType, { nullable: true })
  @Column({ nullable: true })
  valuationType?: ValuationType;
}

@ObjectType()
export class AcademicAreaCourseYearValuationEdge extends EdgeType('AcademicAreaCourseYearValuation', AcademicAreaCourseYearValuation) { }

@ObjectType()
export class AcademicAreaCourseYearValuationConnection extends ConnectionType<AcademicAreaCourseYearValuationEdge>(
  'AcademicAreaCourseYearValuation',
  AcademicAreaCourseYearValuationEdge
) { }
