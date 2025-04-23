import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { IModelCampusData } from '../../interfaces/IModelCampusData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { SchoolYear } from '../SchoolAdministrator/SchoolYear';
import { AcademicDay } from './AcademicDay';

@Index("index_full", ["academicDayId", "campusId"])
@ObjectType({ description: 'The AcademicHour model', implements: IModelCampusData })
@Entity()
export class AcademicHour extends IModelCampusData {
  @Index("index_academicDayId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  academicDayId?: string;

  @Field({ nullable: true })
  academicDay?: AcademicDay;

  @Field({ nullable: true })
  @Column({ nullable: true })
  startTime?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  endTime?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  order?: number;

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
export class AcademicHourEdge extends EdgeType('AcademicHour', AcademicHour) { }

@ObjectType()
export class AcademicHourConnection extends ConnectionType<AcademicHourEdge>(
  'AcademicHour',
  AcademicHourEdge
) { }
