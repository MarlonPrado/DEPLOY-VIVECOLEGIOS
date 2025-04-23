import { Field, InputType } from 'type-graphql';
import { Inbox } from '../../models/GeneralAdministrator/Inbox';

@InputType()
export class NewInbox implements Partial<Inbox> {
  @Field({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  fromId?: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  dateSend?: Date;

  @Field({ nullable: true })
  dateRead?: Date;
}
