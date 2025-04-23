import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';
import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { GeneralAcademicAsignature } from './GeneralAcademicAsignature';
import { GeneralAcademicCycle } from './GeneralAcademicCycle';

@Index("index_full", ["generalAcademicAsignatureId", "generalAcademicCycleId"])
@ObjectType({ description: 'The GeneralAcademicStandard model', implements: IModelData })
@Entity()
export class GeneralAcademicStandard extends IModelData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  standard?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  subtype?: string;

  @Index("index_generalAcademicAsignatureId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  generalAcademicAsignatureId?: string;

  @Field({ nullable: true })
  generalAcademicAsignature?: GeneralAcademicAsignature;

  @Index("index_generalAcademicCycleId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  generalAcademicCycleId?: string;

  @Field({ nullable: true })
  generalAcademicCycle?: GeneralAcademicCycle;
}

@ObjectType()
export class GeneralAcademicStandardEdge extends EdgeType(
  'GeneralAcademicStandard',
  GeneralAcademicStandard
) { }

@ObjectType()
export class GeneralAcademicStandardConnection extends ConnectionType<GeneralAcademicStandardEdge>(
  'GeneralAcademicStandard',
  GeneralAcademicStandardEdge
) { }
