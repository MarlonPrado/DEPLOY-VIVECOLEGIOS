import { Field, InputType } from 'type-graphql';

import { Forum } from '../../models/CampusAdministrator/Forum';

@InputType()
export class NewForum implements Partial<Forum> {
  @Field(() => String, { nullable: true })
  schoolId?: string;

  @Field({ nullable: true })
  campusId?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  details?: string;

  @Field({ nullable: true })
  academicAsignatureCourseId?: string;

  @Field({ nullable: true })
  schoolYearId?: string;
}
