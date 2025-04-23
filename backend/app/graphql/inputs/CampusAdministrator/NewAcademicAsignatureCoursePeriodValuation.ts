import { Field, InputType } from 'type-graphql';
import { ValuationType } from '../../enums/ValuationType';
import { AcademicAsignatureCoursePeriodValuation } from '../../models/CampusAdministrator/AcademicAsignatureCoursePeriodValuation';

@InputType()
export class NewAcademicAsignatureCoursePeriodValuation implements Partial<AcademicAsignatureCoursePeriodValuation> {
    @Field({ nullable: true })
    academicAsignatureCourseId?: string;

    @Field({ nullable: true })
    academicPeriodId?: string;

    @Field({ nullable: true })
    studentId?: String;

    @Field({ nullable: true })
    assessment?: number;

    @Field({ nullable: true })
    performanceLevelId?: String;

    @Field(() => ValuationType, { nullable: true })
    valuationType?: ValuationType;
}
