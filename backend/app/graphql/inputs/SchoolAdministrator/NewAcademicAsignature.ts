import { Field, InputType } from 'type-graphql';

import { AcademicAsignature } from './../../models/SchoolAdministrator/AcademicAsignature';

@InputType()
export class NewAcademicAsignature implements Partial<AcademicAsignature> {
  @Field({ nullable: true })
  schoolId?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  abbreviation?: string;

  @Field({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  minWeight?: number;

  @Field({ nullable: true })
  maxWeight?: number;

  @Field({ nullable: true })
  academicAreaId?: string;

  @Field(() => [String], { nullable: true })
  academicGradeId?: [string];

  @Field({ nullable: true })
  generalAcademicAsignatureId?: string;

  @Field({ nullable: true })
  order?: number;

  @Field({ nullable: true })
  schoolYearId?: string;
}
