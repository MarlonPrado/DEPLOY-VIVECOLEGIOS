import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';

@ObjectType({ description: 'The GeneralAcademicArea model', implements: IModelData })
@Entity()
export class GeneralAcademicArea extends IModelData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  hasStandard?: Boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  hasDba?: Boolean;
}

@ObjectType()
export class GeneralAcademicAreaEdge extends EdgeType('GeneralAcademicArea', GeneralAcademicArea) { }

@ObjectType()
export class GeneralAcademicAreaConnection extends ConnectionType<GeneralAcademicAreaEdge>(
  'GeneralAcademicArea',
  GeneralAcademicAreaEdge
) { }
