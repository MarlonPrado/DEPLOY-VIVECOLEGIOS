import { Field, ObjectType } from 'type-graphql';
import { Column } from 'typeorm';
import { EvaluativeComponent } from '../SchoolAdministrator/EvaluativeComponent';

@ObjectType({ description: 'The ClassroomPlanPerformanceAppraisalStrategy model' })
export class ClassroomPlanPerformanceAppraisalStrategy {
    @Field({ nullable: true })
    @Column({ nullable: true })
    evaluativeComponentId?: string;

    @Field({ nullable: true })
    evaluativeComponent?: EvaluativeComponent;

    @Field({ nullable: true })
    @Column({ nullable: true })
    description?: String;
}