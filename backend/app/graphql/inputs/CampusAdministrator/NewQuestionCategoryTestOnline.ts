import { Field, InputType } from 'type-graphql';
import { QuestionCategoryTestOnline } from '../../models/CampusAdministrator/QuestionCategoryTestOnline';

@InputType()
export class NewQuestionCategoryTestOnline implements Partial<QuestionCategoryTestOnline> {
    @Field({ nullable: true })
    campusId?: string;

    @Field({ nullable: true })
    questionBankTestOnlineId?: string;

    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    description?: string;
}
