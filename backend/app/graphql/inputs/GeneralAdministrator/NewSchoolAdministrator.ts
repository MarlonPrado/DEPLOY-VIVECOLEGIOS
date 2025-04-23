import { Field, InputType } from 'type-graphql';

import { SchoolAdministrator } from '../../models/GeneralAdministrator/SchoolAdministrator';
import { NewUser } from './NewUser';

@InputType()
export class NewSchoolAdministrator implements Partial<SchoolAdministrator> {
  @Field(() => [String], { nullable: true })
  schoolId?: string[];

  @Field({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  newUser?: NewUser;

  @Field({ nullable: true })
  support?: boolean;
}
