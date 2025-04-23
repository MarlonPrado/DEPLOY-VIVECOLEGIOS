import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';
import { ExperienceLearningType } from '../../enums/ExperienceLearningType';
import { IModelCampusData } from '../../interfaces/IModelCampusData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { Student } from '../GeneralAdministrator/Student';
import { AcademicPeriod } from '../SchoolAdministrator/AcademicPeriod';
import { EvaluativeComponent } from '../SchoolAdministrator/EvaluativeComponent';
import { PerformanceLevel } from '../SchoolAdministrator/PerformanceLevel';
import { AcademicAsignatureCourse } from './AcademicAsignatureCourse';

@Index("index_full", ["academicAsignatureCourseId", "academicPeriodId", "studentId", "evaluativeComponentId", "performanceLevelId", "campusId"])
@ObjectType({
  description: 'The ExperienceLearningAverageValuation model',
  implements: IModelCampusData,
})
@Entity()
export class ExperienceLearningAverageValuation extends IModelCampusData {
  @Index("index_academicAsignatureCourseId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  academicAsignatureCourseId?: string;

  @Field({ nullable: true })
  academicAsignatureCourse?: AcademicAsignatureCourse;

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
  average?: number;

  @Field(() => ExperienceLearningType, { nullable: true })
  @Column({ nullable: true })
  experienceLearningType?: ExperienceLearningType;

  @Index("index_evaluativeComponentId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  evaluativeComponentId?: string;

  @Field({ nullable: true })
  evaluativeComponent?: EvaluativeComponent;

  @Index("index_performanceLevelId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  performanceLevelId?: String;

  @Field(() => PerformanceLevel, { nullable: true })
  performanceLevel?: PerformanceLevel;
}

@ObjectType()
export class ExperienceLearningAverageValuationEdge extends EdgeType(
  'ExperienceLearningAverageValuation',
  ExperienceLearningAverageValuation
) { }

@ObjectType()
export class ExperienceLearningAverageValuationConnection extends ConnectionType<ExperienceLearningAverageValuationEdge>(
  'ExperienceLearningAverageValuation',
  ExperienceLearningAverageValuationEdge
) { }
