import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';

@ObjectType({ description: 'The PlantaDocente model', implements: IModelData })
@Entity()
export class PlantaDocente extends IModelData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  documento?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  empleado?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  cargo?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  municipio?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  school_id?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  sede_dane?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  fechanacimiento?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  sexo?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  telefono?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  direccion?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  procesado?: boolean;
}

@ObjectType()
export class PlantaDocenteEdge extends EdgeType('PlantaDocente', PlantaDocente) {}

@ObjectType()
export class PlantaDocenteConnection extends ConnectionType<PlantaDocenteEdge>(
  'PlantaDocente',
  PlantaDocenteEdge
) {}
