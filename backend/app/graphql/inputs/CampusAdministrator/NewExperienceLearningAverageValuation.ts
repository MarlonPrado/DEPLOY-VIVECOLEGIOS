import { Field, InputType } from 'type-graphql';
import { ExperienceLearningType } from '../../enums/ExperienceLearningType';
import { ExperienceLearningAverageValuation } from '../../models/CampusAdministrator/ExperienceLearningAverageValuation';

@InputType()
export class NewExperienceLearningAverageValuation
  implements Partial<ExperienceLearningAverageValuation>
{
  @Field({ nullable: true })
  academicAsignatureCourseId?: string;

  @Field({ nullable: true })
  academicPeriodId?: string;

  @Field({ nullable: true })
  studentId?: String;

  @Field({ nullable: true })
  average?: number;

  @Field(() => ExperienceLearningType, { nullable: true })
  experienceLearningType?: ExperienceLearningType;

  @Field({ nullable: true })
  evaluativeComponentId?: string;

  @Field({ nullable: true })
  performanceLevelId?: String;
}
