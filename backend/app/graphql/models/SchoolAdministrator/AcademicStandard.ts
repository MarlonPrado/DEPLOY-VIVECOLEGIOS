import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';
import { IModelSchoolData } from '../../interfaces/IModelSchoolData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { GeneralAcademicStandard } from '../GeneralAdministrator/GeneralAcademicStandard';
import { AcademicAsignature } from './AcademicAsignature';
import { AcademicGrade } from './AcademicGrade';

@Index("index_full", ["generalAcademicStandardId", "academicAsignatureId", "academicGradeId", "schoolId"])
@ObjectType({ description: 'The AcademicStandard model', implements: IModelSchoolData })
@Entity()
export class AcademicStandard extends IModelSchoolData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  standard?: string;

  @Index("index_generalAcademicStandardId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  generalAcademicStandardId?: string;

  @Field({ nullable: true })
  generalAcademicStandard?: GeneralAcademicStandard;

  @Index("index_academicAsignatureId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  academicAsignatureId?: string;

  @Field({ nullable: true })
  academicAsignature?: AcademicAsignature;

  @Index("index_academicGradeId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  academicGradeId?: string;

  @Field({ nullable: true })
  academicGrade?: AcademicGrade;

}

@ObjectType()
export class AcademicStandardEdge extends EdgeType('AcademicStandard', AcademicStandard) { }

@ObjectType()
export class AcademicStandardConnection extends ConnectionType<AcademicStandardEdge>(
  'AcademicStandard',
  AcademicStandardEdge
) { }
