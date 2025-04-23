import { Field, InputType } from 'type-graphql';

import { AverageAcademicPeriodCourse } from '../../models/CampusAdministrator/AverageAcademicPeriodCourse';

@InputType()
export class NewAverageAcademicPeriodCourse implements Partial<AverageAcademicPeriodCourse> {
    @Field({ nullable: true })
    academicPeriodId?: string;

    @Field({ nullable: true })
    courseId?: string;

    @Field({ nullable: true })
    assessment?: number;

    @Field({ nullable: true })
    performanceLevelId?: String;
}
