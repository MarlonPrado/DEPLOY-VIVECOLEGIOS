import { Field, InputType } from 'type-graphql';

import { Day } from '../../enums/Day';
import { AcademicDay } from '../../models/CampusAdministrator/AcademicDay';

@InputType()
export class NewAcademicDay implements Partial<AcademicDay> {
  @Field({ nullable: true })
  campusId?: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => [Day], { nullable: true })
  day?: [Day];

  @Field({ nullable: true })
  schoolYearId?: string;

  @Field({ nullable: true })
  schoolId?: string;
}
