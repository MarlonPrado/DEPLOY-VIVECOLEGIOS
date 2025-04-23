import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { IModelCampusData } from '../../interfaces/IModelCampusData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { Student } from '../GeneralAdministrator/Student';
import { AcademicPeriod } from '../SchoolAdministrator/AcademicPeriod';
import { PerformanceLevel } from '../SchoolAdministrator/PerformanceLevel';
import { Course } from './Course';

@Index("index_full", ["academicPeriodId", "courseId", "studentId", "performanceLevelId", "campusId"])
@ObjectType({ description: 'The AverageAcademicPeriodStudent model', implements: IModelCampusData })
@Entity()
export class AverageAcademicPeriodStudent extends IModelCampusData {

  @Index("index_academicPeriodId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  academicPeriodId?: string;

  @Field({ nullable: true })
  academicPeriod?: AcademicPeriod;

  @Index("index_courseId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  courseId?: string;

  @Field({ nullable: true })
  course?: Course;

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

  @Field({ nullable: true })
  @Column({ nullable: true })
  score?: number;
}

@ObjectType()
export class AverageAcademicPeriodStudentEdge extends EdgeType('AverageAcademicPeriodStudent', AverageAcademicPeriodStudent) { }

@ObjectType()
export class AverageAcademicPeriodStudentConnection extends ConnectionType<AverageAcademicPeriodStudentEdge>(
  'AverageAcademicPeriodStudent',
  AverageAcademicPeriodStudentEdge
) { }
