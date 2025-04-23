import { Field, InputType } from 'type-graphql';
import { GeneralAcademicCycle } from '../../models/GeneralAdministrator/GeneralAcademicCycle';

@InputType()
export class NewGeneralAcademicCycle implements Partial<GeneralAcademicCycle> {
  @Field({ nullable: true })
  name?: string;
}
