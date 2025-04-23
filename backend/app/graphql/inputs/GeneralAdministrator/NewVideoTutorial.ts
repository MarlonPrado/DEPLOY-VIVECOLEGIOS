import { Field, InputType } from 'type-graphql';

import { VideoTutorial } from '../../models/GeneralAdministrator/VideoTutorial';

@InputType()
export class NewVideoTutorial implements Partial<VideoTutorial> {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  image?: string;

  @Field({ nullable: true })
  miniumResolutionFileUrl?: string;

  @Field({ nullable: true })
  mediumResolutionFileUrl?: string;

  @Field({ nullable: true })
  maxResolutionFileUrl?: string;

  @Field({ nullable: true })
  order?: Number;

  @Field(() => [String], { nullable: true })
  rolesId?: String[];
}
