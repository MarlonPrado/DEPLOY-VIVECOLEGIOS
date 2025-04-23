import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';

@ObjectType({ description: 'The Cursos model', implements: IModelData })
@Entity()
export class Cursos extends IModelData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  dane?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  consecutivo?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  jornada?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  grado_cod?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  grupo?: string;
}

@ObjectType()
export class CursosEdge extends EdgeType('Cursos', Cursos) {}

@ObjectType()
export class CursosConnection extends ConnectionType<CursosEdge>('Cursos', CursosEdge) {}
