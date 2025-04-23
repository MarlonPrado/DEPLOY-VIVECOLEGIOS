import { Field, InputType } from 'type-graphql';

import { Student } from '../../models/GeneralAdministrator/Student';
import { NewUser } from './NewUser';

@InputType()
export class NewStudent implements Partial<Student> {
  @Field(() => [String], { nullable: true })
  schoolId?: string[];

  @Field(() => [String], { nullable: true })
  campusId?: string[];

  @Field({ nullable: true })
  academicGradeId?: string;

  @Field({ nullable: true })
  courseId?: string;

  @Field({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  newUser?: NewUser;

  @Field({ nullable: true })
  code?: number;

  @Field(() => String, { nullable: true })
  schoolYearId?: string;
}
