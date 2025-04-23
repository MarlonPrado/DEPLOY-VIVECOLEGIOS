import { Field, InputType } from 'type-graphql';
import { QuestionTypeTestOnline } from '../../enums/QuestionTypeTestOnline';
import { QuestionTestOnline } from '../../models/CampusAdministrator/QuestionTestOnline';


@InputType()
export class NewQuestionTestOnline implements Partial<QuestionTestOnline> {
    @Field({ nullable: true })
    campusId?: string;

    @Field({ nullable: true })
    questionCategoryTestOnlineId?: string;

    @Field(() => QuestionTypeTestOnline, { nullable: true })
    questionType?: QuestionTypeTestOnline;

    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    statement?: string;
}
