import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { IModelCampusData } from '../../interfaces/IModelCampusData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { AcademicGrade } from '../SchoolAdministrator/AcademicGrade';
import { SchoolYear } from '../SchoolAdministrator/SchoolYear';
import { AcademicDay } from './AcademicDay';
import { Teacher } from './Teacher';

@Index("index_full", ["schoolYearId", "campusId", "schoolId"])
@ObjectType({ description: 'The Course model', implements: IModelCampusData })
@Entity()
export class Course extends IModelCampusData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  academicGradeId?: string;

  @Field({ nullable: true })
  academicGrade?: AcademicGrade;

  @Field({ nullable: true })
  @Column({ nullable: true })
  academicDayId?: string;

  @Field({ nullable: true })
  academicDay?: AcademicDay;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  order?: string;

  @Field(() => [String], { nullable: true })
  @Column({ nullable: true })
  studentsId?: String[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  teacherId?: string;

  @Field({ nullable: true })
  teacher?: Teacher;

  @Field({ nullable: true })
  @Column({ nullable: true })
  jornadaSIMAT?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  gradoCodSIMAT?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  grupoSIMAT?: string;

  @Field({ nullable: true })
  countStudent?: number;

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
export class CourseEdge extends EdgeType('Course', Course) { }

@ObjectType()
export class CourseConnection extends ConnectionType<CourseEdge>('Course', CourseEdge) { }
