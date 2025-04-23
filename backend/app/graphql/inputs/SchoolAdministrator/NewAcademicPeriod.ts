import { Field, InputType } from 'type-graphql';

import { AcademicPeriod } from '../../models/SchoolAdministrator/AcademicPeriod';

@InputType()
export class NewAcademicPeriod implements Partial<AcademicPeriod> {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  schoolYearId?: string;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field({ nullable: true })
  startDateRecovery?: Date;

  @Field({ nullable: true })
  endDateRecovery?: Date;

  @Field({ nullable: true })
  weight?: number;

  @Field({ nullable: true })
  schoolId?: string;

  @Field({ nullable: true })
  order?: number;
}
