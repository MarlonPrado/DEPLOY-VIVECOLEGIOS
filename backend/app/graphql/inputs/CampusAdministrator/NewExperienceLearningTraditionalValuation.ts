import { Field, InputType } from 'type-graphql';
import { ExperienceLearningTraditionalValuation } from '../../models/CampusAdministrator/ExperienceLearningTraditionalValuation';

@InputType()
export class NewExperienceLearningTraditionalValuation
  implements Partial<ExperienceLearningTraditionalValuation>
{
  @Field({ nullable: true })
  campusId?: string;

  @Field({ nullable: true })
  experienceLearningId?: string;

  @Field({ nullable: true })
  studentId?: String;

  @Field({ nullable: true })
  assessment?: number;

  @Field({ nullable: true })
  performanceLevelId?: String;
}
