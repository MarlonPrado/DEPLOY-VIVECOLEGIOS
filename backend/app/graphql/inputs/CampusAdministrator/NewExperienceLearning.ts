import { Field, InputType } from 'type-graphql';
import { ExperienceLearningType } from '../../enums/ExperienceLearningType';
import { ExperienceType } from '../../enums/ExperienceType';
import { NavigationMethodTestOnline } from '../../enums/NavigationMethodTestOnline';
import { ExperienceLearning } from '../../models/CampusAdministrator/ExperienceLearning';
import { NewExperienceLearningPerformanceLevel } from './NewExperienceLearningPerformanceLevel';

@InputType()
export class NewExperienceLearning implements Partial<ExperienceLearning> {
  @Field({ nullable: true })
  campusId?: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  academicAsignatureCourseId?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => ExperienceType, { nullable: true })
  experienceType?: ExperienceType;

  @Field(() => ExperienceLearningType, { nullable: true })
  experienceLearningType?: ExperienceLearningType;

  @Field({ nullable: true })
  dateDelivery?: Date;

  @Field(() => [String], { nullable: true })
  learningsId?: String[];

  @Field(() => [String], { nullable: true })
  evidenceLearningsId?: String[];

  @Field({ nullable: true })
  academicPeriodId?: string;

  @Field(() => [String], { nullable: true })
  evaluativeComponentsId?: String[];

  @Field({ nullable: true })
  onlineDelivery?: Boolean;

  @Field({ nullable: true })
  criteria?: String;

  @Field(() => [NewExperienceLearningPerformanceLevel], { nullable: true })
  experienceLearningPerformanceLevel?: NewExperienceLearningPerformanceLevel[];

  @Field({ nullable: true })
  openTestDate?: Date;

  @Field({ nullable: true })
  closeTestDate?: Date;

  @Field(() => NavigationMethodTestOnline, { nullable: true })
  navigationMethod?: NavigationMethodTestOnline;

  @Field({ nullable: true })
  shuffleQuestions?: Boolean;
}
