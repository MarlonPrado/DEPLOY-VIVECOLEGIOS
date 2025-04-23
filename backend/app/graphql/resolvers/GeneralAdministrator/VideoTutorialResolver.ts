import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { RoleRepository, UserRepository, VideoTutorialRepository } from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewVideoTutorial } from '../../inputs/GeneralAdministrator/NewVideoTutorial';
import { IContext } from '../../interfaces/IContext';
import { Role } from '../../models/GeneralAdministrator/Role';
import { User } from '../../models/GeneralAdministrator/User';
import { VideoTutorial, VideoTutorialConnection } from '../../models/GeneralAdministrator/VideoTutorial';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(VideoTutorial)
export class VideoTutorialResolver {
  @InjectRepository(VideoTutorial)
  private repository = VideoTutorialRepository;

  @InjectRepository(Role)
  private repositoryRole = RoleRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @Query(() => VideoTutorial, { nullable: true })
  async getVideoTutorial(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => VideoTutorialConnection)
  async getAllVideoTutorial(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
  ): Promise<VideoTutorialConnection> {
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
    let resultConn = new VideoTutorialConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Query(() => VideoTutorialConnection)
  async getAllVideoTutorialByRol(
    @Args() args: ConnectionArgs,
    @Arg('roleId', () => String) roleId: String,
  ): Promise<VideoTutorialConnection> {
    let result;
    let rolesIds: any[] = [];
    rolesIds.push(roleId)
    result = await this.repository.findBy({
      where: {
        rolesId: { $in: rolesIds },
        active: true,
      },
      order: { createdAt: 'DESC' },
    });
    let resultConn = new VideoTutorialConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => VideoTutorial)
  async createVideoTutorial(
    @Arg('data') data: NewVideoTutorial,
    @Ctx() context: IContext
  ): Promise<VideoTutorial> {
    let dataProcess: NewVideoTutorial = removeEmptyStringElements(data);
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

  @Mutation(() => VideoTutorial)
  async updateVideoTutorial(
    @Arg('data') data: NewVideoTutorial,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<VideoTutorial | null> {
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
  async changeActiveVideoTutorial(
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
  async deleteVideoTutorial(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: VideoTutorial) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: VideoTutorial) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => [Role], { nullable: true })
  async roles(@Root() data: VideoTutorial) {
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
