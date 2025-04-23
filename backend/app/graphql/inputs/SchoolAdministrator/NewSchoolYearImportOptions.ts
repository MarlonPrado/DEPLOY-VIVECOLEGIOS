import { Field, InputType } from 'type-graphql';

import { SchoolYearImportOptions } from '../../models/SchoolAdministrator/SchoolYearImportOptions';

@InputType()
export class NewSchoolYearImportOptions implements Partial<SchoolYearImportOptions> {
  @Field({ nullable: true })
  academicPeriod?: boolean;

  @Field({ nullable: true })
  academicDay?: boolean;

  @Field({ nullable: true })
  academicHour?: boolean;

  @Field({ nullable: true })
  educationLevel?: boolean;

  @Field({ nullable: true })
  performanceLevel?: boolean;

  @Field({ nullable: true })
  evaluativeComponent?: boolean;

  @Field({ nullable: true })
  modality?: boolean;

  @Field({ nullable: true })
  speciality?: boolean;

  @Field({ nullable: true })
  area?: boolean;

  @Field({ nullable: true })
  asignature?: boolean;

  @Field({ nullable: true })
  grade?: boolean;

  @Field({ nullable: true })
  gradeAssignment?: boolean;

  @Field({ nullable: true })
  course?: boolean;

  @Field({ nullable: true })
  academicAsignatureCourse?: boolean;

  @Field({ nullable: true })
  teacher?: boolean;

  @Field({ nullable: true })
  studentPromoted?: boolean;

  @Field({ nullable: true })
  studentNoPromoted?: boolean;
}

