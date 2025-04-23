import { Field, InputType } from 'type-graphql';
import { GeneralAcademicArea } from '../../models/GeneralAdministrator/GeneralAcademicArea';

@InputType()
export class NewGeneralAcademicArea implements Partial<GeneralAcademicArea> {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  hasStandard?: Boolean;

  @Field({ nullable: true })
  hasDba?: Boolean;
}
