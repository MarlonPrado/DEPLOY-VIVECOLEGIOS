import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';

@ObjectType({ description: 'The GeneralPerformanceLevel model', implements: IModelData })
@Entity()
export class GeneralPerformanceLevel extends IModelData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;
}

@ObjectType()
export class GeneralPerformanceLevelEdge extends EdgeType(
  'GeneralPerformanceLevel',
  GeneralPerformanceLevel
) {}

@ObjectType()
export class GeneralPerformanceLevelConnection extends ConnectionType<GeneralPerformanceLevelEdge>(
  'GeneralPerformanceLevel',
  GeneralPerformanceLevelEdge
) {}
