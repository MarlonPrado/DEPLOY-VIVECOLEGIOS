import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { MenuItemRepository, MenuRepository, ModuleRepository, RoleRepository, UserRepository } from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewMenu } from '../../inputs/GeneralAdministrator/NewMenu';
import { IContext } from '../../interfaces/IContext';
import { Menu, MenuConnection } from '../../models/GeneralAdministrator/Menu';
import { MenuItem } from '../../models/GeneralAdministrator/MenuItem';
import { Module } from '../../models/GeneralAdministrator/Module';
import { Role } from '../../models/GeneralAdministrator/Role';
import { User } from '../../models/GeneralAdministrator/User';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(Menu)
export class MenuResolver {
  @InjectRepository(Menu)
  private repository = MenuRepository;

  @InjectRepository(Role)
  private repositoryRole = RoleRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(Module)
  private repositoryModule = ModuleRepository;

  @InjectRepository(MenuItem)
  private repositoryMenuItem = MenuItemRepository;

  @Query(() => Menu, { nullable: true })
  async getMenu(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => MenuConnection)
  async getAllMenu(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean
  ): Promise<MenuConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        result = await this.repository.findBy({
          order: { createdAt: 'DESC' },
        });
      } else {
        result = await this.repository.find();
      }
    } else {
      if (orderCreated) {
        result = await this.repository.findBy({
          where: {
            active: true,
          },
          order: { createdAt: 'DESC' },
        });
      } else {
        result = await this.repository.findBy({
          where: {
            active: true,
          },
        });
      }
    }
    let resultConn = new MenuConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => Menu)
  async createMenu(@Arg('data') data: NewMenu, @Ctx() context: IContext): Promise<Menu> {
    let dataProcess: NewMenu = removeEmptyStringElements(data);
    let createdByUserId = context?.user?.authorization?.id;
    const model = await this.repository.create({
      ...dataProcess,
      active: true,
      version: 0,
      createdByUserId,
    });
    let result = await this.repository.save(model);
    return result;
  }

  @Mutation(() => Menu)
  async updateMenu(
    @Arg('data') data: NewMenu,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Menu | null> {
    let dataProcess = removeEmptyStringElements(data);
    let updatedByUserId = context?.user?.authorization?.id;
    let result = await this.repository.findOneBy(id);
    result = await this.repository.save({
      _id: new ObjectId(id),
      ...result,
      ...dataProcess,
      version: (result?.version as number) + 1,
      updatedByUserId,
    });
    return result;
  }

  @Mutation(() => Boolean)
  async changeActiveMenu(
    @Arg('active', () => Boolean) active: boolean,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    let updatedByUserId = context?.user?.authorization?.id;
    let result = await this.repository.findOneBy(id);
    result = await this.repository.save({
      _id: new ObjectId(id),
      ...result,
      active: active,
      version: (result?.version as number) + 1,
      updatedByUserId,
    });
    if (result.id) {
      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => Boolean)
  async deleteMenu(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: Menu) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: Menu) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Menu, { nullable: true })
  async module(@Root() data: Menu) {
    let id = data.moduleId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryModule.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => [MenuItem], { nullable: true })
  async menuItems(@Root() data: Menu) {
    let id = data.id;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryMenuItem.findBy({ where: { menuId: id.toString() } });
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => [Role], { nullable: true })
  async roles(@Root() data: Menu) {
    let ids = data.rolesId;
    if (ids !== null && ids !== undefined) {
      let dataIds: any[] = [];
      ids.forEach(async (id: any) => {
        dataIds.push(new ObjectId(id));
      });
      const result = await this.repositoryRole.findBy({ where: { _id: { $in: dataIds } } });
      return result;
    }
    return null;
  }
}
