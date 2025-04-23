import { Field, InputType } from 'type-graphql';

import { AcademicAsignatureCoursePeriodEvidenceLearningValuation } from '../../models/CampusAdministrator/AcademicAsignatureCoursePeriodEvidenceLearningValuation';

@InputType()
export class NewAcademicAsignatureCoursePeriodEvidenceLearningValuation implements Partial<AcademicAsignatureCoursePeriodEvidenceLearningValuation> {
  @Field({ nullable: true })
  evidenceLearningId?: String;

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

}