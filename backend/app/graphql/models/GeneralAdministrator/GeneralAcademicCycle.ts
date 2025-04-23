import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';

@ObjectType({ description: 'The GeneralAcademicCycle model', implements: IModelData })
@Entity()
export class GeneralAcademicCycle extends IModelData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;
}

@ObjectType()
export class GeneralAcademicCycleEdge extends EdgeType(
  'GeneralAcademicCycle',
  GeneralAcademicCycle
) {}

@ObjectType()
export class GeneralAcademicCycleConnection extends ConnectionType<GeneralAcademicCycleEdge>(
  'GeneralAcademicCycle',
  GeneralAcademicCycleEdge
) {}
