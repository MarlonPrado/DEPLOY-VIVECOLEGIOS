import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';

@ObjectType({ description: 'The Municipality model', implements: IModelData })
@Entity()
export class Municipality extends IModelData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;
}

@ObjectType()
export class MunicipalityEdge extends EdgeType('Municipality', Municipality) {}

@ObjectType()
export class MunicipalityConnection extends ConnectionType<MunicipalityEdge>(
  'Municipality',
  MunicipalityEdge
) {}
