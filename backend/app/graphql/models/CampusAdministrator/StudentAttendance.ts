import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { IModelCampusData } from '../../interfaces/IModelCampusData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { Student } from '../GeneralAdministrator/Student';
import { AcademicPeriod } from '../SchoolAdministrator/AcademicPeriod';
import { AcademicAsignatureCourse } from './AcademicAsignatureCourse';

@Index("index_full", ["academicAsignatureCourseId", "academicPeriodId", "studentId", "campusId"])
@ObjectType({ description: 'The StudentAttendance model', implements: IModelCampusData })
@Entity()
export class StudentAttendance extends IModelCampusData {
  @Index("index_academicAsignatureCourseId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  academicAsignatureCourseId?: string;

  @Field({ nullable: true })
  academicAsignatureCourse?: AcademicAsignatureCourse;

  @Index("index_academicPeriodId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  academicPeriodId?: string;

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
  day?: Date;
}

@ObjectType()
export class StudentAttendanceEdge extends EdgeType('StudentAttendance', StudentAttendance) { }

@ObjectType()
export class StudentAttendanceConnection extends ConnectionType<StudentAttendanceEdge>(
  'StudentAttendance',
  StudentAttendanceEdge
) { }
