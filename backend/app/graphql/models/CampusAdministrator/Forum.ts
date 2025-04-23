import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { IModelCampusData } from '../../interfaces/IModelCampusData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { SchoolYear } from '../SchoolAdministrator/SchoolYear';
import { AcademicAsignatureCourse } from './AcademicAsignatureCourse';

@Index("index_full", ["schoolYearId", "campusId", "schoolId", "academicAsignatureCourseId"])
@ObjectType({ description: 'The Forum model', implements: IModelCampusData })
@Entity()
export class Forum extends IModelCampusData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  details?: string;

  @Index("index_academicAsignatureCourseId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  academicAsignatureCourseId?: string;

  @Field({ nullable: true })
  academicAsignatureCourse?: AcademicAsignatureCourse;

  @Index("index_schoolYearId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  schoolYearId?: string;

  @Field({ nullable: true })
  schoolYear?: SchoolYear;
}

@ObjectType()
export class ForumEdge extends EdgeType('Forum', Forum) { }

@ObjectType()
export class ForumConnection extends ConnectionType<ForumEdge>(
  'Forum',
  ForumEdge
) { }
