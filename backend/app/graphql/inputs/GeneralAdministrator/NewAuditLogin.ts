import { Field, InputType } from 'type-graphql';
import { AuditLogin } from '../../models/GeneralAdministrator/AuditLogin';

@InputType()
export class NewAuditLogin implements Partial<AuditLogin> {
  @Field({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  userIp?: string;

  @Field({ nullable: true })
  userPort?: string;

  @Field({ nullable: true })
  userAgent?: string;

  @Field({ nullable: true })
  auth?: Boolean;
}
