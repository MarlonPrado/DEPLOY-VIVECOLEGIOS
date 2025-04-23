import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';
import { IModelCampusData } from '../../interfaces/IModelCampusData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { AcademicAsignature } from '../SchoolAdministrator/AcademicAsignature';
import { GradeAssignment } from '../SchoolAdministrator/GradeAssignment';
import { SchoolYear } from '../SchoolAdministrator/SchoolYear';
import { Course } from './Course';
import { Teacher } from './Teacher';

@Index("index_full", ["academicAsignatureId", "courseId", "teacherId", "gradeAssignmentId", "campusId"])
@ObjectType({ description: 'The AcademicAsignatureCourse model', implements: IModelCampusData })
@Entity()
export class AcademicAsignatureCourse extends IModelCampusData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  hourlyIntensity?: number;

  @Index("index_academicAsignatureId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  academicAsignatureId?: string;

  @Field({ nullable: true })
  academicAsignature?: AcademicAsignature;

  @Index("index_courseId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  courseId?: string;

  @Field({ nullable: true })
  course?: Course;

  @Field({ nullable: true })
  @Column({ nullable: true })
  weight?: number;

  @Index("index_teacherId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  teacherId?: string;

  @Field({ nullable: true })
  teacher?: Teacher;

  @Index("index_gradeAssignmentId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  gradeAssignmentId?: string;

  @Field({ nullable: true })
  gradeAssignment?: GradeAssignment;

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
export class AcademicAsignatureCourseEdge extends EdgeType(
  'AcademicAsignatureCourse',
  AcademicAsignatureCourse
) { }

@ObjectType()
export class AcademicAsignatureCourseConnection extends ConnectionType<AcademicAsignatureCourseEdge>(
  'AcademicAsignatureCourse',
  AcademicAsignatureCourseEdge
) { }
