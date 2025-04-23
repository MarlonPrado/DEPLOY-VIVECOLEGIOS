import { Field, InputType } from 'type-graphql';
import { AcademicStandard } from '../../models/SchoolAdministrator/AcademicStandard';

@InputType()
export class NewAcademicStandard implements Partial<AcademicStandard> {
  @Field({ nullable: true })
  standard?: string;

  @Field({ nullable: true })
  generalAcademicStandardId?: string;

  @Field({ nullable: true })
  academicAsignatureId?: string;

  @Field({ nullable: true })
  academicGradeId?: string;

  @Field({ nullable: true })
  schoolId?: string;
}
