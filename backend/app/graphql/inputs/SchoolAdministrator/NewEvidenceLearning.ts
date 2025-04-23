import { Field, InputType } from 'type-graphql';
import { EvidenceLearning } from '../../models/SchoolAdministrator/EvidenceLearning';

@InputType()
export class NewEvidenceLearning implements Partial<EvidenceLearning> {
    @Field({ nullable: true })
    statement?: string;

    @Field({ nullable: true })
    learningId?: string;

    @Field({ nullable: true })
    schoolId?: string;

}
