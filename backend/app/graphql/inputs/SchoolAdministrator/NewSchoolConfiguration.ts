import { Field, InputType } from 'type-graphql';

import { SchoolConfiguration } from '../../models/SchoolAdministrator/SchoolConfiguration';

@InputType()
export class NewSchoolConfiguration implements Partial<SchoolConfiguration> {
  @Field({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  valueNumber?: number;

  @Field({ nullable: true })
  valueString?: string;

  @Field({ nullable: true })
  schoolId?: string;

  @Field({ nullable: true })
  schoolYearId?: string;
}