import { Field, InputType } from 'type-graphql';
import { Campus } from '../../models/GeneralAdministrator/Campus';

@InputType()
export class NewCampus implements Partial<Campus> {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  daneCodeCampus?: string;

  @Field({ nullable: true })
  consecutive?: string;

  @Field({ nullable: true })
  schoolId?: string;
}
