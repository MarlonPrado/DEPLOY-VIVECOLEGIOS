import { Field, ObjectType } from 'type-graphql';
import { Column } from 'typeorm';

@ObjectType({ description: 'The SchoolYearImportOptions model' })
export class SchoolYearImportOptions {
  @Field({ nullable: true })
  @Column({ nullable: true })
  academicPeriod?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  academicDay?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  academicHour?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  educationLevel?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  performanceLevel?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  evaluativeComponent?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  modality?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  speciality?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  area?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  asignature?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  grade?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  gradeAssignment?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  course?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  academicAsignatureCourse?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  teacher?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  studentPromoted?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  studentNoPromoted?: boolean;
}

