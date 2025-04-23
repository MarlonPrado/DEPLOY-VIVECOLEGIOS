import { Field, InputType } from 'type-graphql';

import { Modality } from '../../models/SchoolAdministrator/Modality';

@InputType()
export class NewModality implements Partial<Modality> {
  @Field({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  schoolId?: string;

  @Field({ nullable: true })
  schoolYearId?: string;
}
