import { Field, InputType } from 'type-graphql';

import { ForumInteraction } from '../../models/CampusAdministrator/ForumInteraction';

@InputType()
export class NewForumInteraction implements Partial<ForumInteraction> {
  @Field({ nullable: true })
  comment?: string;

  @Field(() => String, { nullable: true })
  forumQuestionId?: string;

  @Field(() => String, { nullable: true })
  schoolId?: string;

  @Field({ nullable: true })
  campusId?: string;

  @Field({ nullable: true })
  schoolYearId?: string;
}
