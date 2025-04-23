import { Field, InputType } from 'type-graphql';

import { Teacher } from '../../models/CampusAdministrator/Teacher';
import { NewUser } from '../GeneralAdministrator/NewUser';

@InputType()
export class NewTeacher implements Partial<Teacher> {
  @Field(() => [String], { nullable: true })
  schoolId?: string[];

  @Field(() => [String], { nullable: true })
  campusId?: string[];

  @Field({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  attentionSchedule?: string;

  @Field({ nullable: true })
  newUser?: NewUser;

  @Field(() => [String], { nullable: true })
  academicAsignatureId?: string[];

  @Field(() => String, { nullable: true })
  schoolYearId?: string;
}
