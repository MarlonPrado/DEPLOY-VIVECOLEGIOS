import { Field, InputType } from 'type-graphql';
import { SchoolAdministrative } from '../../models/GeneralAdministrator/SchoolAdministrative';
import { NewUser } from './NewUser';

@InputType()
export class NewSchoolAdministrative implements Partial<SchoolAdministrative> {
  @Field(() => [String], { nullable: true })
  schoolId?: string[];

  @Field({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  newUser?: NewUser;
}
