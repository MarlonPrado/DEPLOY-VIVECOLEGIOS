import { Field, InputType } from 'type-graphql';

import { AcademicGrade } from '../../models/SchoolAdministrator/AcademicGrade';

@InputType()
export class NewAcademicGrade implements Partial<AcademicGrade> {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  educationLevelId?: string;

  @Field({ nullable: true })
  specialtyId?: string;

  @Field({ nullable: true })
  generalAcademicCycleId?: string;

  @Field({ nullable: true })
  generalAcademicGradeId?: string;

  @Field({ nullable: true })
  schoolId?: string;

  @Field({ nullable: true })
  schoolYearId?: string;
}
