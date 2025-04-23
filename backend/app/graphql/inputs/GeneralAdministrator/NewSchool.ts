import { Field, InputType } from 'type-graphql';

import { School } from '../../models/GeneralAdministrator/School';

@InputType()
export class NewSchool implements Partial<School> {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  daneCode?: string;

  @Field({ nullable: true })
  pedagogicalModel?: string;

  @Field({ nullable: true })
  educationalModel?: string;

  @Field({ nullable: true })
  curricularComponent?: string;

  @Field({ nullable: true })
  textResolution?: string;

  @Field({ nullable: true })
  textAddress?: string;

  @Field({ nullable: true })
  textDaneNit?: string;

  @Field({ nullable: true })
  logo?: string;

  @Field({ nullable: true })
  textPrincipalSignature?: string;

  @Field({ nullable: true })
  textSecretarySignature?: string;

  @Field({ nullable: true })
  imgPrincipalSignature?: string;

  @Field({ nullable: true })
  imgSecretarySignature?: string;
}
