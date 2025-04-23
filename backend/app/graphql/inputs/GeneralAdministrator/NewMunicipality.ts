import { Field, InputType } from 'type-graphql';
import { Municipality } from '../../models/GeneralAdministrator/Municipality';

@InputType()
export class NewMunicipality implements Partial<Municipality> {
  @Field({ nullable: true })
  name?: string;
}
