import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { RoleRepository, UserRepository } from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewRole } from '../../inputs/GeneralAdministrator/NewRole';
import { IContext } from '../../interfaces/IContext';
import { Role, RoleConnection } from '../../models/GeneralAdministrator/Role';
import { User } from '../../models/GeneralAdministrator/User';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(Role)
export class RoleResolver {
  @InjectRepository(Role)
  private repository = RoleRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @Query(() => Role, { nullable: true })
  async getRole(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => RoleConnection)
  async getAllRole(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean
  ): Promise<RoleConnection> {
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
    let resultConn = new RoleConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Query(() => RoleConnection)
  async getAllRoleType(
    @Args() args: ConnectionArgs,
    @Arg('type', () => String) type: String
  ): Promise<RoleConnection> {
    let result;
    switch (type) {
      case 'SchoolAdministrator':
        result = await this.repository.findBy({
          where: {
            active: true,
            isSchoolAdministrator: true,
          },
          order: { createdAt: 'DESC' },
        });
        break;
      case 'SchoolAdministrative':
        result = await this.repository.findBy({
          where: {
            active: true,
            isSchoolAdministrative: true,
          },
          order: { createdAt: 'DESC' },
        });
        break;
      case 'CampusAdministrator':
        result = await this.repository.findBy({
          where: {
            active: true,
            isCampusAdministrator: true,
          },
          order: { createdAt: 'DESC' },
        });
        break;
      case 'CampusCoordinator':
        result = await this.repository.findBy({
          where: {
            active: true,
            isCampusCoordinator: true,
          },
          order: { createdAt: 'DESC' },
        });
        break;
      case 'Student':
        result = await this.repository.findBy({
          where: {
            active: true,
            isStudent: true,
          },
          order: { createdAt: 'DESC' },
        });
        break;
      case 'Teacher':
        result = await this.repository.findBy({
          where: {
            active: true,
            isTeacher: true,
          },
          order: { createdAt: 'DESC' },
        });
        break;
      case 'Guardian':
        result = await this.repository.findBy({
          where: {
            active: true,
            isGuardian: true,
          },
          order: { createdAt: 'DESC' },
        });
        break;
      default:
        result = new Array();
        break;
    }
    let resultConn = new RoleConnection();
    if (result) {
      let resultConnection = connectionFromArraySlice(result, args, {
        sliceStart: 0,
        arrayLength: result.length,
      });
      resultConn = { ...resultConnection, totalCount: result.length };
      return resultConn;
    }
    return resultConn;
  }

  @Mutation(() => Role)
  async createRole(@Arg('data') data: NewRole, @Ctx() context: IContext): Promise<Role> {
    let dataProcess: NewRole = removeEmptyStringElements(data);
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

  @Mutation(() => Role)
  async updateRole(
    @Arg('data') data: NewRole,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Role | null> {
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
  async changeActiveRole(
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
  async deleteRole(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: Role) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: Role) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }
}
