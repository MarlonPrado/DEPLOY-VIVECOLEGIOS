import { Field, InputType } from 'type-graphql';

import { EvaluativeComponentType } from '../../enums/EvaluativeComponentType';
import { EvaluativeComponent } from '../../models/SchoolAdministrator/EvaluativeComponent';

@InputType()
export class NewEvaluativeComponent implements Partial<EvaluativeComponent> {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  weight?: number;

  @Field({ nullable: true })
  schoolId?: string;

  @Field({ nullable: true })
  default?: Boolean;

  @Field(() => EvaluativeComponentType, { nullable: true })
  type?: EvaluativeComponentType;

  @Field(() => [String], { nullable: true })
  academicAsignaturesId?: String[];

  @Field(() => [String], { nullable: true })
  academicAreasId?: String[];

  @Field({ nullable: true })
  schoolYearId?: string;
}
