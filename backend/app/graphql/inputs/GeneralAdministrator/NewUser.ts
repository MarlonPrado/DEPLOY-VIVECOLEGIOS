import { Field, InputType } from 'type-graphql';
import { User } from '../../models/GeneralAdministrator/User';
@InputType()
export class NewUser implements Partial<User> {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  genderId?: string;

  @Field({ nullable: true })
  documentTypeId?: string;

  @Field({ nullable: true })
  documentNumber?: string;

  @Field({ nullable: true })
  birthdate?: Date;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  profilePhoto?: string;

  @Field({ nullable: true })
  signaturePhoto?: string;

  @Field({ nullable: true })
  roleId?: string;
}
