import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { IModelCampusData } from '../../interfaces/IModelCampusData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { Student } from '../GeneralAdministrator/Student';
import { AcademicPeriod } from '../SchoolAdministrator/AcademicPeriod';
import { ObserverAnnotationType } from '../SchoolAdministrator/ObserverAnnotationType';
import { Course } from './Course';

@Index("index_full", ["courseId", "academicPeriodId", "studentId", "observerAnnotationTypeId", "campusId"])
@ObjectType({ description: 'The StudentObserverAnnotation model', implements: IModelCampusData })
@Entity()
export class StudentObserverAnnotation extends IModelCampusData {
  @Index("index_courseId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  courseId?: string;

  @Field({ nullable: true })
  course?: Course;

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

  @Index("index_observerAnnotationTypeId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  observerAnnotationTypeId?: string;

  @Field({ nullable: true })
  observerAnnotationType?: ObserverAnnotationType;

  @Field({ nullable: true })
  @Column({ nullable: true })
  observation?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  commitment?: string;
}

@ObjectType()
export class StudentObserverAnnotationEdge extends EdgeType('StudentObserverAnnotation', StudentObserverAnnotation) { }

@ObjectType()
export class StudentObserverAnnotationConnection extends ConnectionType<StudentObserverAnnotationEdge>(
  'StudentObserverAnnotation',
  StudentObserverAnnotationEdge
) { }
