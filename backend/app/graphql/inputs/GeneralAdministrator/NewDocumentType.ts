import { Field, InputType } from 'type-graphql';
import { DocumentType } from '../../models/GeneralAdministrator/DocumentType';

@InputType()
export class NewDocumentType implements Partial<DocumentType> {
  @Field({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;
}
