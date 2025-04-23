import { Field, InputType } from 'type-graphql';
import { Guardian } from '../../models/CampusAdministrator/Guardian';
import { NewUser } from '../GeneralAdministrator/NewUser';

@InputType()
export class NewGuardian implements Partial<Guardian> {
  @Field(() => [String], { nullable: true })
  schoolId?: string[];

  @Field(() => [String], { nullable: true })
  campusId?: string[];

  @Field({ nullable: true })
  userId?: string;

  @Field(() => [String], { nullable: true })
  studentsId?: string[];

  @Field({ nullable: true })
  newUser?: NewUser;
}
