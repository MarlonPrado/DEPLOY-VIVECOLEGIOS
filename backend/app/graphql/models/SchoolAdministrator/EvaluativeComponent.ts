import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { EvaluativeComponentType } from '../../enums/EvaluativeComponentType';
import { IModelSchoolData } from '../../interfaces/IModelSchoolData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { AcademicArea } from './AcademicArea';
import { AcademicAsignature } from './AcademicAsignature';
import { SchoolYear } from './SchoolYear';

@Index("index_full_academicAsignatures", ["academicAsignaturesId", "schoolId", "schoolYearId"])
@Index("index_full_academicAreas", ["academicAreasId", "schoolId", "schoolYearId"])
@ObjectType({ description: 'The EvaluativeComponent model', implements: IModelSchoolData })
@Entity()
export class EvaluativeComponent extends IModelSchoolData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  weight?: number;

  @Field(() => EvaluativeComponentType, { nullable: true })
  @Column({ nullable: true })
  type?: EvaluativeComponentType;

  @Index("index_academicAsignaturesId")
  @Field(() => [String], { nullable: true })
  @Column({ nullable: true })
  academicAsignaturesId?: String[];

  @Field(() => [AcademicAsignature], { nullable: true })
  academicAsignatures?: AcademicAsignature[];

  @Index("index_academicAreasId")
  @Field(() => [String], { nullable: true })
  @Column({ nullable: true })
  academicAreasId?: String[];

  @Field(() => [AcademicArea], { nullable: true })
  academicAreas?: AcademicArea[];

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
export class EvaluativeComponentEdge extends EdgeType('EvaluativeComponent', EvaluativeComponent) { }

@ObjectType()
export class EvaluativeComponentConnection extends ConnectionType<EvaluativeComponentEdge>(
  'EvaluativeComponent',
  EvaluativeComponentEdge
) { }
