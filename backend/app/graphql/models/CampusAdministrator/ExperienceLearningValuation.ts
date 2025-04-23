import { Field, ObjectType } from 'type-graphql';
import { Column } from 'typeorm';
import { IModelCampusData } from '../../interfaces/IModelCampusData';
import { Student } from '../GeneralAdministrator/Student';
import { PerformanceLevel } from '../SchoolAdministrator/PerformanceLevel';
import { ExperienceLearning } from './ExperienceLearning';

@ObjectType({ description: 'The ExperienceLearningValuation model', implements: IModelCampusData })
export class ExperienceLearningValuation extends IModelCampusData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  experienceLearningId?: string;

  @Field({ nullable: true })
  experienceLearning?: ExperienceLearning;

  @Field({ nullable: true })
  @Column({ nullable: true })
  studentId?: String;

  @Field({ nullable: true })
  student?: Student;

  @Field({ nullable: true })
  @Column({ nullable: true })
  assessment?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  performanceLevelId?: String;

  @Field(() => PerformanceLevel, { nullable: true })
  performanceLevel?: PerformanceLevel;
}
