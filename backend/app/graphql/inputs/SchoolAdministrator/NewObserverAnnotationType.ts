import { Field, InputType } from 'type-graphql';
import { ObserverAnnotationType } from '../../models/SchoolAdministrator/ObserverAnnotationType';

@InputType()
export class NewObserverAnnotationType implements Partial<ObserverAnnotationType> {
  @Field({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  schoolId?: string;
}
