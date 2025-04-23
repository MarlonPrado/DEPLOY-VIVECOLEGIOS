import { Field, InputType } from 'type-graphql';

import { AcademicAsignatureCourse } from '../../models/CampusAdministrator/AcademicAsignatureCourse';

@InputType()
export class NewAcademicAsignatureCourse implements Partial<AcademicAsignatureCourse> {
  @Field({ nullable: true })
  hourlyIntensity?: number;

  @Field({ nullable: true })
  campusId?: string;

  @Field({ nullable: true })
  academicAsignatureId?: string;

  @Field({ nullable: true })
  courseId?: string;

  @Field({ nullable: true })
  weight?: number;

  @Field({ nullable: true })
  teacherId?: string;

  @Field({ nullable: true })
  gradeAssignmentId?: string;

  @Field({ nullable: true })
  schoolId?: string;

  @Field({ nullable: true })
  schoolYearId?: string;
}
