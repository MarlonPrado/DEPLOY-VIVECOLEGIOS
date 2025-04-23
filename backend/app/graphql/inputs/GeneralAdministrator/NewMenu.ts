import { Field, InputType } from 'type-graphql';
import { Menu } from '../../models/GeneralAdministrator/Menu';

@InputType()
export class NewMenu implements Partial<Menu> {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  icon?: string;

  @Field({ nullable: true })
  order?: number;

  @Field({ nullable: true })
  parentId?: string;

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
