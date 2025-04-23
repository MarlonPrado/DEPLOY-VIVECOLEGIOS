import { Field, InputType } from 'type-graphql';
import { ExperienceLearningRubricCriteriaPerformanceLevel } from '../../models/CampusAdministrator/ExperienceLearningRubricCriteriaPerformanceLevel';

@InputType()
export class NewExperienceLearningRubricCriteriaPerformanceLevel implements Partial<ExperienceLearningRubricCriteriaPerformanceLevel> {
    @Field({ nullable: true })
    criteria?: String;

    @Field({ nullable: true })
    performanceLevelId?: String;
}
