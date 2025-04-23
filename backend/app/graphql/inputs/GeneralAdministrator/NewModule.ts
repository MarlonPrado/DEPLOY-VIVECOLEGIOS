import { Field, InputType } from 'type-graphql';
import { Module } from '../../models/GeneralAdministrator/Module';

@InputType()
export class NewModule implements Partial<Module> {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  url?: string;
}
