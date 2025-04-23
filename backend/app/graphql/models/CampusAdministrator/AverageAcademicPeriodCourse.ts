import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { IModelCampusData } from '../../interfaces/IModelCampusData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { AcademicPeriod } from '../SchoolAdministrator/AcademicPeriod';
import { PerformanceLevel } from '../SchoolAdministrator/PerformanceLevel';
import { Course } from './Course';

@Index("index_full", ["academicPeriodId", "courseId", "performanceLevelId", "campusId"])
@ObjectType({ description: 'The AverageAcademicPeriodCourse model', implements: IModelCampusData })
@Entity()
export class AverageAcademicPeriodCourse extends IModelCampusData {

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
export class AverageAcademicPeriodCourseEdge extends EdgeType('AverageAcademicPeriodCourse', AverageAcademicPeriodCourse) { }

@ObjectType()
export class AverageAcademicPeriodCourseConnection extends ConnectionType<AverageAcademicPeriodCourseEdge>(
  'AverageAcademicPeriodCourse',
  AverageAcademicPeriodCourseEdge
) { }
