import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Lazy } from '../../../types';
import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { MenuItem } from './MenuItem';
import { Module } from './Module';
import { Role } from './Role';

@Index("index_full", ["moduleId", "rolesId"])
@ObjectType({ description: 'The Menu model', implements: IModelData })
@Entity()
export class Menu extends IModelData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  icon?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  order?: number;

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

  @Field(() => [MenuItem], { nullable: true })
  menuItems?: [MenuItem];

  @Field(() => [MenuItem], { nullable: true })
  menuItemsLogin?: [MenuItem];

  @Field({ nullable: true })
  @Column({ nullable: true })
  isHidden?: Boolean;
}

@ObjectType()
export class MenuEdge extends EdgeType('Menu', Menu) { }

@ObjectType()
export class MenuConnection extends ConnectionType<MenuEdge>('Menu', MenuEdge) { }
