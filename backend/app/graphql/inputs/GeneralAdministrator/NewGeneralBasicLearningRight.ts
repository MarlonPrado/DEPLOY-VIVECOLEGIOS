import { Field, InputType } from 'type-graphql';
import { GeneralBasicLearningRight } from '../../models/GeneralAdministrator/GeneralBasicLearningRight';

@InputType()
export class NewGeneralBasicLearningRight implements Partial<GeneralBasicLearningRight> {
    @Field({ nullable: true })
    dba?: string;

    @Field({ nullable: true })
    category?: string;

    @Field({ nullable: true })
    generalAcademicAsignatureId?: string;

    @Field({ nullable: true })
    generalAcademicGradeId?: string;
}
