import { Field, InputType } from 'type-graphql';
import { MenuItem } from '../../models/GeneralAdministrator/MenuItem';

@InputType()
export class NewMenuItem implements Partial<MenuItem> {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  icon?: string;

  @Field({ nullable: true })
  order?: Number;

  @Field({ nullable: true })
  menuId?: string;

  @Field({ nullable: true })
  moduleId?: string;

  @Field(() => [String], { nullable: true })
  rolesId?: String[];

  @Field({ nullable: true })
  createAction?: Boolean;

  @Field({ nullable: true })
  deleteAction?: Boolean;

  @Field({ nullable: true })
  updateAction?: Boolean;

  @Field({ nullable: true })
  readAction?: Boolean;

  @Field({ nullable: true })
  fullAccess?: Boolean;

  @Field({ nullable: true })
  activateAction?: Boolean;

  @Field({ nullable: true })
  inactiveAction?: Boolean;

  @Field({ nullable: true })
  isHidden?: Boolean;
}
