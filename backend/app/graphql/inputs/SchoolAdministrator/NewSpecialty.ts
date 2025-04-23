import { Field, InputType } from 'type-graphql';

import { Specialty } from '../../models/SchoolAdministrator/Specialty';

@InputType()
export class NewSpecialty implements Partial<Specialty> {
  @Field({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  modalityId?: string;

  @Field({ nullable: true })
  schoolId?: string;

  @Field({ nullable: true })
  schoolYearId?: string;
}
