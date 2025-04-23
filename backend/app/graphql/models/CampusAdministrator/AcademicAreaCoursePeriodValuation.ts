import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';
import { ValuationType } from '../../enums/ValuationType';

import { IModelCampusData } from '../../interfaces/IModelCampusData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { Student } from '../GeneralAdministrator/Student';
import { AcademicArea } from '../SchoolAdministrator/AcademicArea';
import { AcademicPeriod } from '../SchoolAdministrator/AcademicPeriod';
import { PerformanceLevel } from '../SchoolAdministrator/PerformanceLevel';

@Index("index_full", ["academicAreaId", "academicPeriodId", "studentId", "campusId"])
@ObjectType({ description: 'The AcademicAreaCoursePeriodValuation model', implements: IModelCampusData })
@Entity()
export class AcademicAreaCoursePeriodValuation extends IModelCampusData {

  @Index("index_academicAreaId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  academicAreaId?: string;

  @Field({ nullable: true })
  academicArea?: AcademicArea;

  @Index("index_academicPeriodId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  academicPeriodId?: string;

  @Field({ nullable: true })
  academicPeriod?: AcademicPeriod;

  @Index("index_studentId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  studentId?: String;

  @Field({ nullable: true })
  student?: Student;

  @Field({ nullable: true })
  @Column({ nullable: true })
  assessment?: number;

  @Index("index_performanceLevelId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  performanceLevelId?: String;

  @Field(() => PerformanceLevel, { nullable: true })
  performanceLevel?: PerformanceLevel;

  @Field(() => ValuationType, { nullable: true })
  @Column({ nullable: true })
  valuationType?: ValuationType;
}

@ObjectType()
export class AcademicAreaCoursePeriodValuationEdge extends EdgeType('AcademicAreaCoursePeriodValuation', AcademicAreaCoursePeriodValuation) { }

@ObjectType()
export class AcademicAreaCoursePeriodValuationConnection extends ConnectionType<AcademicAreaCoursePeriodValuationEdge>(
  'AcademicAreaCoursePeriodValuation',
  AcademicAreaCoursePeriodValuationEdge
) { }
