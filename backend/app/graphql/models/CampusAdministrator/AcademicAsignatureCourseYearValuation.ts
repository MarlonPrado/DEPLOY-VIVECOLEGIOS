import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';
import { ValuationType } from '../../enums/ValuationType';
import { IModelCampusData } from '../../interfaces/IModelCampusData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { Student } from '../GeneralAdministrator/Student';
import { PerformanceLevel } from '../SchoolAdministrator/PerformanceLevel';
import { SchoolYear } from '../SchoolAdministrator/SchoolYear';
import { AcademicAsignatureCourse } from './AcademicAsignatureCourse';

@Index("index_full", ["academicAsignatureCourseId", "schoolYearId", "studentId", "performanceLevelId", "campusId"])
@ObjectType({ description: 'The AcademicAsignatureCourseYearValuation model', implements: IModelCampusData })
@Entity()
export class AcademicAsignatureCourseYearValuation extends IModelCampusData {

  @Index("index_academicAsignatureCourseId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  academicAsignatureCourseId?: string;

  @Field({ nullable: true })
  academicAsignatureCourse?: AcademicAsignatureCourse;

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
export class AcademicAsignatureCourseYearValuationEdge extends EdgeType('AcademicAsignatureCourseYearValuation', AcademicAsignatureCourseYearValuation) { }

@ObjectType()
export class AcademicAsignatureCourseYearValuationConnection extends ConnectionType<AcademicAsignatureCourseYearValuationEdge>(
  'AcademicAsignatureCourseYearValuation',
  AcademicAsignatureCourseYearValuationEdge
) { }
