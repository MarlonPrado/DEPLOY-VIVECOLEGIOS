import { Field, InputType } from 'type-graphql';

import { AcademicArea } from '../../models/SchoolAdministrator/AcademicArea';

@InputType()
export class NewAcademicArea implements Partial<AcademicArea> {
  @Field({ nullable: true })
  schoolId?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  abbreviation?: string;

  @Field({ nullable: true })
  generalAcademicAreaId?: string;

  @Field(() => [String], { nullable: true })
  academicGradeId?: [string];

  @Field({ nullable: true })
  order?: number;

  @Field({ nullable: true })
  isAverage?: boolean;

  @Field({ nullable: true })
  schoolYearId?: string;

}
