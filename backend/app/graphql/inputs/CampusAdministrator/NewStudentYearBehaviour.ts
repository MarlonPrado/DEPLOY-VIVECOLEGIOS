import { Field, InputType } from 'type-graphql';

import { StudentYearBehaviour } from '../../models/CampusAdministrator/StudentYearBehaviour';

@InputType()
export class NewStudentYearBehaviour implements Partial<StudentYearBehaviour> {

  @Field({ nullable: true })
  courseId?: string;

  @Field({ nullable: true })
  schoolYearId?: string;

  @Field({ nullable: true })
  studentId?: String;

  @Field({ nullable: true })
  assessment?: number;

  @Field({ nullable: true })
  performanceLevelId?: String;

  @Field({ nullable: true })
  observation?: string;
}
