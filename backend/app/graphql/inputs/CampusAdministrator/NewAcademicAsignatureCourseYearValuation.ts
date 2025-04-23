import { Field, InputType } from 'type-graphql';
import { ValuationType } from '../../enums/ValuationType';
import { AcademicAsignatureCourseYearValuation } from '../../models/CampusAdministrator/AcademicAsignatureCourseYearValuation';

@InputType()
export class NewAcademicAsignatureCourseYearValuation implements Partial<AcademicAsignatureCourseYearValuation> {
    @Field({ nullable: true })
    academicAsignatureCourseId?: string;

    @Field({ nullable: true })
    schoolYearId?: string;

    @Field({ nullable: true })
    studentId?: String;

    @Field({ nullable: true })
    assessment?: number;

    @Field({ nullable: true })
    performanceLevelId?: String;

    @Field(() => ValuationType, { nullable: true })
    valuationType?: ValuationType;
}
