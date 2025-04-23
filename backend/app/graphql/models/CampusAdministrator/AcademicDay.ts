import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { Day } from '../../enums/Day';
import { IModelCampusData } from '../../interfaces/IModelCampusData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { SchoolYear } from '../SchoolAdministrator/SchoolYear';

@Index("index_full", ["schoolYearId", "campusId", "schoolId"])
@ObjectType({ description: 'The AcademicDay model', implements: IModelCampusData })
@Entity()
export class AcademicDay extends IModelCampusData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  nameSIMAT?: string;

  @Field(() => [Day], { nullable: true })
  @Column({ nullable: true })
  day?: [Day];

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
export class AcademicDayEdge extends EdgeType('AcademicDay', AcademicDay) { }

@ObjectType()
export class AcademicDayConnection extends ConnectionType<AcademicDayEdge>(
  'AcademicDay',
  AcademicDayEdge
) { }
