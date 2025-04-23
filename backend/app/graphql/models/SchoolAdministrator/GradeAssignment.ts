import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';
import { IModelSchoolData } from '../../interfaces/IModelSchoolData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { AcademicAsignature } from './AcademicAsignature';
import { AcademicGrade } from './AcademicGrade';
import { SchoolYear } from './SchoolYear';

@Index("index_full", ["academicGradeId", "academicAsignatureId", "schoolId"])
@ObjectType({ description: 'The GradeAssignment model', implements: IModelSchoolData })
@Entity()
export class GradeAssignment extends IModelSchoolData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  minHourlyIntensity?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  maxHourlyIntensity?: number;

  @Index("index_academicGradeId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  academicGradeId?: string;

  @Field({ nullable: true })
  academicGrade?: AcademicGrade;

  @Index("index_academicAsignatureId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  academicAsignatureId?: string;

  @Field({ nullable: true })
  academicAsignature?: AcademicAsignature;

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
export class GradeAssignmentEdge extends EdgeType('GradeAssignment', GradeAssignment) { }

@ObjectType()
export class GradeAssignmentConnection extends ConnectionType<GradeAssignmentEdge>(
  'GradeAssignment',
  GradeAssignmentEdge
) { }
