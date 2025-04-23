import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';
import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { GeneralAcademicArea } from './GeneralAcademicArea';

@ObjectType({ description: 'The GeneralAcademicAsignature model', implements: IModelData })
@Entity()
export class GeneralAcademicAsignature extends IModelData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Index("index_generalAcademicAreaId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  generalAcademicAreaId?: string;

  @Field({ nullable: true })
  generalAcademicArea?: GeneralAcademicArea;

  @Field({ nullable: true })
  @Column({ nullable: true })
  hasStandard?: Boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  hasDba?: Boolean;
}

@ObjectType()
export class GeneralAcademicAsignatureEdge extends EdgeType(
  'GeneralAcademicAsignature',
  GeneralAcademicAsignature
) { }

@ObjectType()
export class GeneralAcademicAsignatureConnection extends ConnectionType<GeneralAcademicAsignatureEdge>(
  'GeneralAcademicAsignature',
  GeneralAcademicAsignatureEdge
) { }
