import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { IModelCampusData } from '../../interfaces/IModelCampusData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { Student } from '../GeneralAdministrator/Student';
import { AcademicPeriod } from '../SchoolAdministrator/AcademicPeriod';
import { EvidenceLearning } from '../SchoolAdministrator/EvidenceLearning';
import { PerformanceLevel } from '../SchoolAdministrator/PerformanceLevel';
import { AcademicAsignatureCourse } from './AcademicAsignatureCourse';

@Index("index_full", ["evidenceLearningId", "academicAsignatureCourseId", "academicPeriodId", "studentId", "campusId"])
@ObjectType({ description: 'The AcademicAsignatureCoursePeriodEvidenceLearningValuation model', implements: IModelCampusData })
@Entity()
export class AcademicAsignatureCoursePeriodEvidenceLearningValuation extends IModelCampusData {
  @Index("index_evidenceLearningId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  evidenceLearningId?: String;

  @Field(() => EvidenceLearning, { nullable: true })
  evidenceLearning?: EvidenceLearning;

  @Index("index_academicAsignatureCourseId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  academicAsignatureCourseId?: String;

  @Field({ nullable: true })
  academicAsignatureCourse?: AcademicAsignatureCourse;

  @Index("index_academicPeriodId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  academicPeriodId?: String;

  @Field({ nullable: true })
  academicPeriod?: AcademicPeriod;

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
}


@ObjectType()
export class AcademicAsignatureCoursePeriodEvidenceLearningValuationEdge extends EdgeType('AcademicAsignatureCoursePeriodEvidenceLearningValuation', AcademicAsignatureCoursePeriodEvidenceLearningValuation) { }

@ObjectType()
export class AcademicAsignatureCoursePeriodEvidenceLearningValuationConnection extends ConnectionType<AcademicAsignatureCoursePeriodEvidenceLearningValuationEdge>(
  'AcademicAsignatureCoursePeriodEvidenceLearningValuation',
  AcademicAsignatureCoursePeriodEvidenceLearningValuationEdge
) { }
