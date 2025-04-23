import { Field, InputType } from 'type-graphql';
import { Learning } from '../../models/SchoolAdministrator/Learning';

@InputType()
export class NewLearning implements Partial<Learning> {
    @Field({ nullable: true })
    statement?: string;

    @Field({ nullable: true })
    academicAsignatureId?: string;

    @Field({ nullable: true })
    generalBasicLearningRightId?: string;

    @Field({ nullable: true })
    academicStandardId?: string;

    @Field({ nullable: true })
    academicGradeId?: string;

    @Field({ nullable: true })
    schoolId?: string;

    @Field(() => [String], { nullable: true })
    academicPeriodsId?: String[];;

}
