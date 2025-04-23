import { Field, InputType } from 'type-graphql';

import { FrecuentQuestion } from '../../models/GeneralAdministrator/FrecuentQuestion';

@InputType()
export class NewFrecuentQuestion implements Partial<FrecuentQuestion> {
  @Field({ nullable: true })
  question?: string;

  @Field({ nullable: true })
  response?: string;

  @Field({ nullable: true })
  order?: Number;

  @Field(() => [String], { nullable: true })
  rolesId?: String[];
}

