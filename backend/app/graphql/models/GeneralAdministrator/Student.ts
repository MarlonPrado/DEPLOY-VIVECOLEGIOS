import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { Course } from '../CampusAdministrator/Course';
import { AcademicGrade } from '../SchoolAdministrator/AcademicGrade';
import { SchoolYear } from '../SchoolAdministrator/SchoolYear';
import { Campus } from './Campus';
import { School } from './School';
import { User } from './User';

@Index("index_full_school", ["schoolId", "academicGradeId", "courseId", "userId", "schoolYearId"])
@Index("index_full_campus", ["campusId", "academicGradeId", "courseId", "userId", "schoolYearId"])
@ObjectType({ description: 'The Student model', implements: IModelData })
@Entity()
export class Student extends IModelData {
  @Index("index_schoolId")
  @Field(() => [String], { nullable: true })
  @Column({ nullable: true })
  schoolId?: String[];

  @Field(() => [School], { nullable: true })
  school?: School[];

  @Index("index_campusId")
  @Field(() => [String], { nullable: true })
  @Column({ nullable: true })
  campusId?: String[];

  @Field(() => [Campus], { nullable: true })
  campus?: Campus[];

  @Index("index_academicGradeId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  academicGradeId?: string;

  @Field({ nullable: true })
  academicGrade?: AcademicGrade;

  @Index("index_courseId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  courseId?: string;

  @Field({ nullable: true })
  course?: Course;

  @Index("index_userId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  user?: User;

  @Field({ nullable: true })
  @Column({ nullable: true })
  code?: number;

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
export class StudentEdge extends EdgeType('Student', Student) { }

@ObjectType()
export class StudentConnection extends ConnectionType<StudentEdge>('Student', StudentEdge) { }
