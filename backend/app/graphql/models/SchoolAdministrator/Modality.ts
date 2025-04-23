import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { IModelSchoolData } from '../../interfaces/IModelSchoolData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { SchoolYear } from './SchoolYear';

@Index("index_full", ["schoolYearId", "schoolId"])
@ObjectType({ description: 'The Modality model', implements: IModelSchoolData })
@Entity()
export class Modality extends IModelSchoolData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  code?: string;

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
  entityBaseId?: string;
}

@ObjectType()
export class ModalityEdge extends EdgeType('Modality', Modality) { }

@ObjectType()
export class ModalityConnection extends ConnectionType<ModalityEdge>('Modality', ModalityEdge) { }
