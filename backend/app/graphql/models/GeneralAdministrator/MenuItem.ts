import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Lazy } from '../../../types';
import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { Menu } from './Menu';
import { Module } from './Module';
import { Role } from './Role';

@Index("index_full", ["menuId", "moduleId", "rolesId"])
@ObjectType({ description: 'The MenuItem model', implements: IModelData })
@Entity()
export class MenuItem extends IModelData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  icon?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  order?: Number;

  @ManyToOne(() => Menu, (data) => data.id, { lazy: true })
  @Field(() => Menu, { nullable: true })
  menu?: Lazy<Menu>;

  @Index("index_menuId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  menuId?: string;

  @ManyToOne(() => Module, (data) => data.id, { lazy: true })
  @Field(() => Module, { nullable: true })
  module?: Lazy<Module>;

  @Index("index_moduleId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  moduleId?: string;

  @Index("index_rolesId")
  @Field(() => [String], { nullable: true })
  @Column({ nullable: true })
  rolesId?: String[];

  @Field(() => [Role], { nullable: true })
  roles?: Role[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  createAction?: Boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  deleteAction?: Boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  updateAction?: Boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  readAction?: Boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  fullAccess?: Boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  activateAction?: Boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  inactiveAction?: Boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  isHidden?: Boolean;

}

@ObjectType()
export class MenuItemEdge extends EdgeType('MenuItem', MenuItem) { }

@ObjectType()
export class MenuItemConnection extends ConnectionType<MenuItemEdge>('MenuItem', MenuItemEdge) { }
