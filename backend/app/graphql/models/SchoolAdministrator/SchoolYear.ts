import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';

import { IModelSchoolData } from '../../interfaces/IModelSchoolData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { SchoolYearImportOptions } from './SchoolYearImportOptions';

@ObjectType({ description: 'The SchoolYear model', implements: IModelSchoolData })
@Entity()
export class SchoolYear extends IModelSchoolData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  schoolYear?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  endDate?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  folioNumber?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  schoolYearImportId?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  schoolYearImportOptions?: SchoolYearImportOptions;
}

@ObjectType()
export class SchoolYearEdge extends EdgeType('SchoolYear', SchoolYear) { }

@ObjectType()
export class SchoolYearConnection extends ConnectionType<SchoolYearEdge>(
  'SchoolYear',
  SchoolYearEdge
) { }
