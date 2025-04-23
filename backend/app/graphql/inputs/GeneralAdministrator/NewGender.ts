import { Field, InputType } from 'type-graphql';
import { Gender } from '../../models/GeneralAdministrator/Gender';

@InputType()
export class NewGender implements Partial<Gender> {
  @Field({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;
}
