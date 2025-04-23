import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { IModelSchoolData } from '../../interfaces/IModelSchoolData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { Modality } from './Modality';
import { SchoolYear } from './SchoolYear';

@Index("index_full", ["modalityId", "schoolId", "schoolYearId"])
@ObjectType({ description: 'The Specialty model', implements: IModelSchoolData })
@Entity()
export class Specialty extends IModelSchoolData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Index("index_modality")
  @Field({ nullable: true })
  @Column({ nullable: true })
  modalityId?: string;

  @Field({ nullable: true })
  modality?: Modality;

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
export class SpecialtyEdge extends EdgeType('Specialty', Specialty) { }

@ObjectType()
export class SpecialtyConnection extends ConnectionType<SpecialtyEdge>(
  'Specialty',
  SpecialtyEdge
) { }
