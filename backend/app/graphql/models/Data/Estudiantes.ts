import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';

@ObjectType({ description: 'The Estudiantes model', implements: IModelData })
@Entity()
export class Estudiantes extends IModelData {
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

  @Field({ nullable: true })
  @Column({ nullable: true })
  doc?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  tipodoc?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  apellido1?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  apellido2?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  nombre1?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  nombre2?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  genero?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  fecha_nacimiento?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  procesado?: boolean;
}

@ObjectType()
export class EstudiantesEdge extends EdgeType('Estudiantes', Estudiantes) {}

@ObjectType()
export class EstudiantesConnection extends ConnectionType<EstudiantesEdge>(
  'Estudiantes',
  EstudiantesEdge
) {}
