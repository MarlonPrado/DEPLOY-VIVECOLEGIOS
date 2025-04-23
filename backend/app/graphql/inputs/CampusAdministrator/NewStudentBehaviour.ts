import { Field, InputType } from 'type-graphql';

import { StudentBehaviour } from '../../models/CampusAdministrator/StudentBehaviour';

@InputType()
export class NewStudentBehaviour implements Partial<StudentBehaviour> {

  @Field({ nullable: true })
  courseId?: string;

  @Field({ nullable: true })
  academicPeriodId?: string;

  @Field({ nullable: true })
  studentId?: String;

  @Field({ nullable: true })
  assessment?: number;

  @Field({ nullable: true })
  performanceLevelId?: String;

  @Field({ nullable: true })
  observation?: string;
}
