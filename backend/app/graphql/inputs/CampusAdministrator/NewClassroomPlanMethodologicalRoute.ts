import { Field, InputType } from 'type-graphql';
import { ClassroomPlanMethodologicalRoute } from '../../models/CampusAdministrator/ClassroomPlanMethodologicalRoute';

@InputType()
export class NewClassroomPlanMethodologicalRoute implements Partial<ClassroomPlanMethodologicalRoute> {
    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    description?: String;
}
