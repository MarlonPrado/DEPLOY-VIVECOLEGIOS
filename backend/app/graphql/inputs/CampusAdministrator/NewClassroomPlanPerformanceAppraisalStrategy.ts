import { Field, InputType } from 'type-graphql';
import { ClassroomPlanPerformanceAppraisalStrategy } from '../../models/CampusAdministrator/ClassroomPlanPerformanceAppraisalStrategy';

@InputType()
export class NewClassroomPlanPerformanceAppraisalStrategy implements Partial<ClassroomPlanPerformanceAppraisalStrategy> {

    @Field({ nullable: true })
    evaluativeComponentId?: string;

    @Field({ nullable: true })
    description?: String;
}
