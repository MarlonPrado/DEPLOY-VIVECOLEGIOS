import { Field, InputType } from 'type-graphql';

import { StudentAttendance } from '../../models/CampusAdministrator/StudentAttendance';

@InputType()
export class NewStudentAttendance implements Partial<StudentAttendance> {

  @Field({ nullable: true })
  academicAsignatureCourseId?: string;

  @Field({ nullable: true })
  academicPeriodId?: string;

  @Field({ nullable: true })
  studentId?: String;

  @Field({ nullable: true })
  day?: Date;
}
