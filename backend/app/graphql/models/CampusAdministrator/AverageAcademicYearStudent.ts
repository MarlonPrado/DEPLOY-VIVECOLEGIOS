import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { IModelCampusData } from '../../interfaces/IModelCampusData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { Student } from '../GeneralAdministrator/Student';
import { PerformanceLevel } from '../SchoolAdministrator/PerformanceLevel';
import { SchoolYear } from '../SchoolAdministrator/SchoolYear';
import { Course } from './Course';

@Index("index_full", ["schoolYearId", "courseId", "studentId", "performanceLevelId", "campusId"])
@ObjectType({ description: 'The AverageAcademicYearStudent model', implements: IModelCampusData })
@Entity()
export class AverageAcademicYearStudent extends IModelCampusData {

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

  @Field({ nullable: true })
  @Column({ nullable: true })
  promoted?: boolean;
}

@ObjectType()
export class AverageAcademicYearStudentEdge extends EdgeType('AverageAcademicYearStudent', AverageAcademicYearStudent) { }

@ObjectType()
export class AverageAcademicYearStudentConnection extends ConnectionType<AverageAcademicYearStudentEdge>(
  'AverageAcademicYearStudent',
  AverageAcademicYearStudentEdge
) { }
