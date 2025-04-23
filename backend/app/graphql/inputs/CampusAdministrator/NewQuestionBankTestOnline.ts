import { Field, InputType } from 'type-graphql';
import { QuestionBankTestOnline } from '../../models/CampusAdministrator/QuestionBankTestOnline';

@InputType()
export class NewQuestionBankTestOnline implements Partial<QuestionBankTestOnline> {
    @Field({ nullable: true })
    campusId?: string;

    @Field({ nullable: true })
    academicAsignatureId?: string;

    @Field({ nullable: true })
    academicGradeId?: string;

    @Field({ nullable: true })
    teacherId?: string;
}
