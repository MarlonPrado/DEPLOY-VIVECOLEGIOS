import { Field, InputType } from 'type-graphql';

import { AverageAcademicYearCourse } from '../../models/CampusAdministrator/AverageAcademicYearCourse';

@InputType()
export class NewAverageAcademicYearCourse implements Partial<AverageAcademicYearCourse> {
    @Field({ nullable: true })
    schoolYearId?: string;

    @Field({ nullable: true })
    courseId?: string;

    @Field({ nullable: true })
    assessment?: number;

    @Field({ nullable: true })
    performanceLevelId?: String;
}
