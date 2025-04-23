import { Field, InputType } from 'type-graphql';

import { ForumQuestion } from '../../models/CampusAdministrator/ForumQuestion';

@InputType()
export class NewForumQuestion implements Partial<ForumQuestion> {
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
  schoolYearId?: string;

  @Field({ nullable: true })
  forumId?: string;

}
