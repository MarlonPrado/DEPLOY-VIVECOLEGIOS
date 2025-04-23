import { Field, InputType } from 'type-graphql';
import { ExperienceLearningCoEvaluation } from '../../models/CampusAdministrator/ExperienceLearningCoEvaluation';

@InputType()
export class NewExperienceLearningCoEvaluation implements Partial<ExperienceLearningCoEvaluation> {
  @Field({ nullable: true })
  campusId?: string;

  @Field({ nullable: true })
  experienceLearningId?: string;

  @Field({ nullable: true })
  coEvaluatorId?: String;

  @Field({ nullable: true })
  studentId?: String;

  @Field({ nullable: true })
  assessment?: number;

  @Field({ nullable: true })
  observations?: String;

  @Field({ nullable: true })
  performanceLevelId?: String;
}
