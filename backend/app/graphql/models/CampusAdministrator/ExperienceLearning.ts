import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { ExperienceLearningType } from '../../enums/ExperienceLearningType';
import { ExperienceRecoveryPlanType } from '../../enums/ExperienceRecoveryPlanType';
import { ExperienceType } from '../../enums/ExperienceType';
import { NavigationMethodTestOnline } from '../../enums/NavigationMethodTestOnline';
import { IModelCampusData } from '../../interfaces/IModelCampusData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { AcademicPeriod } from '../SchoolAdministrator/AcademicPeriod';
import { EvaluativeComponent } from '../SchoolAdministrator/EvaluativeComponent';
import { EvidenceLearning } from '../SchoolAdministrator/EvidenceLearning';
import { Learning } from '../SchoolAdministrator/Learning';
import { AcademicAsignatureCourse } from './AcademicAsignatureCourse';
import { ExperienceLearningPerformanceLevel } from './ExperienceLearningPerformanceLevel';

@Index("index_full_evidenceLearnings", ["academicAsignatureCourseId", "evidenceLearningsId", "academicPeriodId", "campusId"])
@Index("index_full_learnings", ["academicAsignatureCourseId", "learningsId", "academicPeriodId", "campusId"])
@Index("index_full_evaluativeComponents", ["academicAsignatureCourseId", "academicPeriodId", "evaluativeComponentsId", "campusId"])
@ObjectType({ description: 'The ExperienceLearning model', implements: IModelCampusData })
@Entity()
export class ExperienceLearning extends IModelCampusData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  title?: string;

  @Index("index_academicAsignatureCourseId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  academicAsignatureCourseId?: string;

  @Field({ nullable: true })
  academicAsignatureCourse?: AcademicAsignatureCourse;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(() => ExperienceType, { nullable: true })
  @Column({ nullable: true })
  experienceType?: ExperienceType;

  @Field(() => ExperienceLearningType, { nullable: true })
  @Column({ nullable: true })
  experienceLearningType?: ExperienceLearningType;

  @Field(() => ExperienceRecoveryPlanType, { nullable: true })
  @Column({ nullable: true })
  experienceRecoveryPlanType?: ExperienceRecoveryPlanType;

  @Field({ nullable: true })
  @Column({ nullable: true })
  dateDelivery?: Date;

  @Index("index_learningsId")
  @Field(() => [String], { nullable: true })
  @Column({ nullable: true })
  learningsId?: String[];

  @Field(() => [Learning], { nullable: true })
  learnigs?: Learning[];

  @Index("index_evidenceLearningsId")
  @Field(() => [String], { nullable: true })
  @Column({ nullable: true })
  evidenceLearningsId?: String[];

  @Field(() => [EvidenceLearning], { nullable: true })
  evidenceLearnings?: EvidenceLearning[];

  @Index("index_academicPeriodId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  academicPeriodId?: string;

  @Field({ nullable: true })
  academicPeriod?: AcademicPeriod;

  @Index("index_evaluativeComponentsId")
  @Field(() => [String], { nullable: true })
  @Column({ nullable: true })
  evaluativeComponentsId?: String[];

  @Field(() => [EvaluativeComponent], { nullable: true })
  evaluativeComponents?: EvaluativeComponent;

  @Field({ nullable: true })
  @Column({ nullable: true })
  onlineDelivery?: Boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  criteria?: String;

  @Field(() => [ExperienceLearningPerformanceLevel], { nullable: true })
  @Column({ nullable: true })
  experienceLearningPerformanceLevel?: ExperienceLearningPerformanceLevel[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  openTestDate?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  closeTestDate?: Date;

  @Field(() => NavigationMethodTestOnline, { nullable: true })
  @Column({ nullable: true })
  navigationMethod?: NavigationMethodTestOnline;

  @Field({ nullable: true })
  @Column({ nullable: true })
  shuffleQuestions?: Boolean;
}

@ObjectType()
export class ExperienceLearningEdge extends EdgeType('ExperienceLearning', ExperienceLearning) { }

@ObjectType()
export class ExperienceLearningConnection extends ConnectionType<ExperienceLearningEdge>(
  'ExperienceLearning',
  ExperienceLearningEdge
) { }
