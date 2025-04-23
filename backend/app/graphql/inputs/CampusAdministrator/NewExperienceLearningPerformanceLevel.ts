import { Field, InputType } from 'type-graphql';
import { ExperienceLearningPerformanceLevel } from '../../models/CampusAdministrator/ExperienceLearningPerformanceLevel';

@InputType()
export class NewExperienceLearningPerformanceLevel implements Partial<ExperienceLearningPerformanceLevel> {
    @Field({ nullable: true })
    criteria?: String;

    @Field({ nullable: true })
    performanceLevelId?: String;
}
