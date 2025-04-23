import { Field, InputType } from 'type-graphql';
import { GeneralAcademicStandard } from '../../models/GeneralAdministrator/GeneralAcademicStandard';

@InputType()
export class NewGeneralAcademicStandard implements Partial<GeneralAcademicStandard> {
  @Field({ nullable: true })
  standard?: string;

  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  subtype?: string;

  @Field({ nullable: true })
  generalAcademicAsignatureId?: string;

  @Field({ nullable: true })
  generalAcademicCycleId?: string;
}
