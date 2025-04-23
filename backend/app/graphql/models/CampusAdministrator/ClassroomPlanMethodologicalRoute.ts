import { Field, ObjectType } from 'type-graphql';
import { Column } from 'typeorm';

@ObjectType({ description: 'The ClassroomPlanMethodologicalRoute model' })
export class ClassroomPlanMethodologicalRoute {

    @Field({ nullable: true })
    @Column({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    description?: String;
}