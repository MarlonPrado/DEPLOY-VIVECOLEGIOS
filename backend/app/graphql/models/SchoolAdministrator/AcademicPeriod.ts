import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { IModelSchoolData } from '../../interfaces/IModelSchoolData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { SchoolYear } from './SchoolYear';

@Index("index_full", ["schoolYearId", "schoolId"])
@ObjectType({ description: 'The AcademicPeriod model', implements: IModelSchoolData })
@Entity()
export class AcademicPeriod extends IModelSchoolData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Index("index_schoolYearId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  schoolYearId?: string;

  @Field({ nullable: true })
  schoolYear?: SchoolYear;

  @Field({ nullable: true })
  @Column({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  endDate?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  startDateRecovery?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  endDateRecovery?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  weight?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  order?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  entityBaseId?: string;
}

@ObjectType()
export class AcademicPeriodEdge extends EdgeType('AcademicPeriod', AcademicPeriod) { }

@ObjectType()
export class AcademicPeriodConnection extends ConnectionType<AcademicPeriodEdge>(
  'AcademicPeriod',
  AcademicPeriodEdge
) { }
