import { Field, InputType } from 'type-graphql';
import { GeneralPerformanceLevel } from '../../models/GeneralAdministrator/GeneralPerformanceLevel';

@InputType()
export class NewGeneralPerformanceLevel implements Partial<GeneralPerformanceLevel> {
  @Field({ nullable: true })
  name?: string;
}
