import { Field, InputType } from 'type-graphql';
import { Email } from '../../models/GeneralAdministrator/Email';

@InputType()
export class NewEmail implements Partial<Email> {
  @Field({ nullable: true })
  toId?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  dateSend?: Date;
}
