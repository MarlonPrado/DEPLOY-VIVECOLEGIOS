import { Field, InputType } from 'type-graphql';
import { ExperienceLearningRubricCriteriaValuation } from '../../models/CampusAdministrator/ExperienceLearningRubricCriteriaValuation';

@InputType()
export class NewExperienceLearningRubricCriteriaValuation
  implements Partial<ExperienceLearningRubricCriteriaValuation>
{
  @Field({ nullable: true })
  experienceLearningRubricCriteriaId?: string;

  @Field({ nullable: true })
  studentId?: String;

  @Field({ nullable: true })
  assessment?: number;

  @Field({ nullable: true })
  performanceLevelId?: String;
}
