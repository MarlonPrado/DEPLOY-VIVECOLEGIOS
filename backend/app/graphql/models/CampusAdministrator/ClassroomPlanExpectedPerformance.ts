import { Field, ObjectType } from 'type-graphql';
import { Column } from 'typeorm';
import { EvaluativeComponent } from '../SchoolAdministrator/EvaluativeComponent';
import { EvidenceLearning } from '../SchoolAdministrator/EvidenceLearning';

@ObjectType({ description: 'The ClassroomPlanExpectedPerformance model' })
export class ClassroomPlanExpectedPerformance {
    @Field({ nullable: true })
    @Column({ nullable: true })
    evaluativeComponentId?: string;

    @Field({ nullable: true })
    evaluativeComponent?: EvaluativeComponent;

    @Field(() => [String], { nullable: true })
    @Column({ nullable: true })
    evidenceLearningsId?: String[];

    @Field(() => [EvidenceLearning], { nullable: true })
    evidenceLearnings?: EvidenceLearning[];

}
