import { Field, InputType } from 'type-graphql';
import { ExperienceLearningRubricCriteria } from '../../models/CampusAdministrator/ExperienceLearningRubricCriteria';
import { NewExperienceLearningRubricCriteriaPerformanceLevel } from './NewExperienceLearningRubricCriteriaPerformanceLevel';

@InputType()
export class NewExperienceLearningRubricCriteria implements Partial<ExperienceLearningRubricCriteria> {
    @Field({ nullable: true })
    experienceLearningId?: string;

    @Field({ nullable: true })
    evidenceLearningId?: String;

    @Field({ nullable: true })
    weight?: number;

    @Field({ nullable: true })
    criteria?: String;

    @Field(() => [NewExperienceLearningRubricCriteriaPerformanceLevel], { nullable: true })
    experienceLearningRubricCriteriaPerformanceLevel?: NewExperienceLearningRubricCriteriaPerformanceLevel[];
}
