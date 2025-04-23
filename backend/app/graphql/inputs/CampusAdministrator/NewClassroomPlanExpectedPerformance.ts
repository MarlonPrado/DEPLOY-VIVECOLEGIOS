import { Field, InputType } from 'type-graphql';
import { ClassroomPlanExpectedPerformance } from '../../models/CampusAdministrator/ClassroomPlanExpectedPerformance';

@InputType()
export class NewClassroomPlanExpectedPerformance implements Partial<ClassroomPlanExpectedPerformance> {
    @Field({ nullable: true })
    evaluativeComponentId?: string;

    @Field(() => [String], { nullable: true })
    evidenceLearningsId?: String[];
}
