import { Field, InputType } from 'type-graphql';
import { ExperienceLearningCoEvaluationValuation } from '../../models/CampusAdministrator/ExperienceLearningCoEvaluationValuation';

@InputType()
export class NewExperienceLearningCoEvaluationValuation
  implements Partial<ExperienceLearningCoEvaluationValuation>
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
