import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { IModelSchoolData } from '../../interfaces/IModelSchoolData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { SchoolYear } from './SchoolYear';

@ObjectType({ description: 'The EducationLevel model', implements: IModelSchoolData })
@Entity()
@Index("index_full", ["schoolYearId", "schoolId"])
export class EducationLevel extends IModelSchoolData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Index("index_schoolYearId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  schoolYearId?: string;

  @Field({ nullable: true })
  schoolYear?: SchoolYear;

  @Field({ nullable: true })
  @Column({ nullable: true })
  entityBaseId?: string;
}

@ObjectType()
export class EducationLevelEdge extends EdgeType('EducationLevel', EducationLevel) { }

@ObjectType()
export class EducationLevelConnection extends ConnectionType<EducationLevelEdge>(
  'EducationLevel',
  EducationLevelEdge
) { }
