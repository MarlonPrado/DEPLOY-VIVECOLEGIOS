import { Field, InputType } from 'type-graphql';

import { AverageAcademicYearStudent } from '../../models/CampusAdministrator/AverageAcademicYearStudent';

@InputType()
export class NewAverageAcademicYearStudent implements Partial<AverageAcademicYearStudent> {
  @Field({ nullable: true })
  schoolYearId?: string;

  @Field({ nullable: true })
  courseId?: string;

  @Field({ nullable: true })
  studentId?: String;

  @Field({ nullable: true })
  assessment?: number;

  @Field({ nullable: true })
  performanceLevelId?: String;

  @Field({ nullable: true })
  score?: number;

  @Field({ nullable: true })
  promoted?: boolean;
}
