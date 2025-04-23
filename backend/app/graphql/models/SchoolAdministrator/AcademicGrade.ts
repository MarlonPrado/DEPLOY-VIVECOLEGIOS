import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { IModelSchoolData } from '../../interfaces/IModelSchoolData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { GeneralAcademicCycle } from '../GeneralAdministrator/GeneralAcademicCycle';
import { GeneralAcademicGrade } from '../GeneralAdministrator/GeneralAcademicGrade';
import { EducationLevel } from './EducationLevel';
import { SchoolYear } from './SchoolYear';
import { Specialty } from './Specialty';

@Index("index_full", ["educationLevelId", "specialtyId", "generalAcademicCycleId", "generalAcademicGradeId", "schoolId", "schoolYearId"])
@ObjectType({ description: 'The AcademicGrade model', implements: IModelSchoolData })
@Entity()
export class AcademicGrade extends IModelSchoolData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Index("index_educationLevelId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  educationLevelId?: string;

  @Field({ nullable: true })
  educationLevel?: EducationLevel;

  @Index("index_specialtyId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  specialtyId?: string;

  @Field({ nullable: true })
  specialty?: Specialty;

  @Index("index_generalAcademicCycleId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  generalAcademicCycleId?: string;

  @Field({ nullable: true })
  generalAcademicCycle?: GeneralAcademicCycle;

  @Index("index_generalAcademicGradeId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  generalAcademicGradeId?: string;

  @Field({ nullable: true })
  generalAcademicGrade?: GeneralAcademicGrade;

  @Field({ nullable: true })
  countStudent?: number;

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
export class AcademicGradeEdge extends EdgeType('AcademicGrade', AcademicGrade) { }

@ObjectType()
export class AcademicGradeConnection extends ConnectionType<AcademicGradeEdge>(
  'AcademicGrade',
  AcademicGradeEdge
) { }
