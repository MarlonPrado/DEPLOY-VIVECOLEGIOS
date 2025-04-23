import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';

@ObjectType({ description: 'The Jornadas model', implements: IModelData })
@Entity()
export class Jornadas extends IModelData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  dane?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  consecutivo?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  jornada?: string;
}

@ObjectType()
export class JornadasEdge extends EdgeType('Jornadas', Jornadas) {}

@ObjectType()
export class JornadasConnection extends ConnectionType<JornadasEdge>('Jornadas', JornadasEdge) {}
