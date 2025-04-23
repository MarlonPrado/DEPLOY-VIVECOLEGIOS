import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { InboxRepository, UserRepository, NotificationRepository } from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewInbox } from '../../inputs/GeneralAdministrator/NewInbox';
import { IContext } from '../../interfaces/IContext';
import { Inbox, InboxConnection } from '../../models/GeneralAdministrator/Inbox';
import { User } from '../../models/GeneralAdministrator/User';
import { ConnectionArgs } from '../../pagination/relaySpecs';
import { getMongoRepository } from 'typeorm';
import { Notification } from '../../models/GeneralAdministrator/Notification';

@Resolver(Inbox)
export class InboxResolver {
  @InjectRepository(Inbox)
  private repository = InboxRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(Notification)
  private notificationRepository = NotificationRepository;

  @Query(() => Inbox, { nullable: true })
  async getInbox(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => InboxConnection)
  async getAllInbox(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('userId', () => String) userId: String,
  ): Promise<InboxConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        result = await this.repository.findBy({
          where: { userId },
          order: { createdAt: 'DESC' },
        });
      } else {
        result = await this.repository.findBy({ where: { userId } });
      }
    } else {
      if (orderCreated) {
        result = await this.repository.findBy({
          where: {
            userId,
            active: true,
          },
          order: { createdAt: 'DESC' },
        });
      } else {
        result = await this.repository.findBy({
          where: {
            userId,
            active: true,
          },
        });
      }
    }
    let resultConn = new InboxConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => Inbox)
  async createInbox(@Arg('data') data: NewInbox, @Ctx() context: IContext): Promise<Inbox> {
    let dataProcess: NewInbox = removeEmptyStringElements(data);
    let createdByUserId = context?.user?.authorization?.id;
    // Crear el mensaje de inbox
    const model = await this.repository.create({
      ...dataProcess,
      active: true,
      version: 0,
      createdByUserId,
    });
    
    let result = await this.repository.save(model);
    
    // Crea una nueva notificacion si el mensaje es de inbox es correcto
    try {
      const notification = this.notificationRepository.create({
        title: `Nuevo mensaje: ${dataProcess.title}`,
        message: `Has recibido un nuevo mensaje en tu bandeja de entrada.`,
        userId: dataProcess.userId, // Destinatario del mensaje
        active: true,
        dateSend: new Date(),
        version: 0,
        createdByUserId,
      });
      
      await this.notificationRepository.save(notification);
      
      console.log(`Notificación creada para el mensaje ID: ${result.id}`);
    } catch (error) {
      console.error('Error al crear notificación automática:', error);
    }
    
    return result;
  }

  @Mutation(() => Inbox)
  async updateInbox(
    @Arg('data') data: NewInbox,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Inbox | null> {
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
  async changeActiveInbox(
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
      console.log('Se ha actualizado el estado del inbox con ID:', result.id);
      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => Boolean)
  async deleteInbox(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: Inbox) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: Inbox) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async user(@Root() data: Inbox) {
    let id = data.userId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async from(@Root() data: Inbox) {
    let id = data.fromId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }
}
