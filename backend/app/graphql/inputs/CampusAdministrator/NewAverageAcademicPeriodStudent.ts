import { Field, InputType } from 'type-graphql';

import { AverageAcademicPeriodStudent } from '../../models/CampusAdministrator/AverageAcademicPeriodStudent';

@InputType()
export class NewAverageAcademicPeriodStudent implements Partial<AverageAcademicPeriodStudent> {
    @Field({ nullable: true })
    academicPeriodId?: string;

    @Field({ nullable: true })
    courseId?: string;

    @Field({ nullable: true })
    studentId?: String;

    @Field({ nullable: true })
    assessment?: number;

    @Field({ nullable: true })
    performanceLevelId?: String;

    @Field({ nullable: true })
    score?: number;
}
