import { Field, InputType } from 'type-graphql';
import { Notification } from '../../models/GeneralAdministrator/Notification';

@InputType()
export class NewNotification implements Partial<Notification> {
  @Field({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  dateSend?: Date;

  @Field({ nullable: true })
  dateRead?: Date;
}
