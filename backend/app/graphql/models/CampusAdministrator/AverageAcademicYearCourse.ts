import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { IModelCampusData } from '../../interfaces/IModelCampusData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { PerformanceLevel } from '../SchoolAdministrator/PerformanceLevel';
import { SchoolYear } from '../SchoolAdministrator/SchoolYear';
import { Course } from './Course';

@Index("index_full", ["schoolYearId", "courseId", "performanceLevelId", "campusId"])
@ObjectType({ description: 'The AverageAcademicYearCourse model', implements: IModelCampusData })
@Entity()
export class AverageAcademicYearCourse extends IModelCampusData {

  @Index("index_schoolYearId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  schoolYearId?: string;

  @Field({ nullable: true })
  schoolYear?: SchoolYear;

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
export class AverageAcademicYearCourseEdge extends EdgeType('AverageAcademicYearCourse', AverageAcademicYearCourse) { }

@ObjectType()
export class AverageAcademicYearCourseConnection extends ConnectionType<AverageAcademicYearCourseEdge>(
  'AverageAcademicYearCourse',
  AverageAcademicYearCourseEdge
) { }
