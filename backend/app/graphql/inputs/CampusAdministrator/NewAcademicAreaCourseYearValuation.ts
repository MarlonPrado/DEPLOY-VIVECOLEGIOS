import { Field, InputType } from 'type-graphql';
import { ValuationType } from '../../enums/ValuationType';

import { AcademicAreaCourseYearValuation } from '../../models/CampusAdministrator/AcademicAreaCourseYearValuation';

@InputType()
export class NewAcademicAreaCourseYearValuation implements Partial<AcademicAreaCourseYearValuation> {
  @Field({ nullable: true })
  academicAreaId?: string;

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