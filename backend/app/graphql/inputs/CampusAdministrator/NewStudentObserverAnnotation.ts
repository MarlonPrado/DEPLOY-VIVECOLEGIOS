import { Field, InputType } from 'type-graphql';

import { StudentObserverAnnotation } from '../../models/CampusAdministrator/StudentObserverAnnotation';

@InputType()
export class NewStudentObserverAnnotation implements Partial<StudentObserverAnnotation> {

  @Field({ nullable: true })
  courseId?: string;

  @Field({ nullable: true })
  academicPeriodId?: string;

  @Field({ nullable: true })
  studentId?: String;

  @Field({ nullable: true })
  observerAnnotationTypeId?: string;

  @Field({ nullable: true })
  observation?: string;

  @Field({ nullable: true })
  commitment?: string;
}
