import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { CampusRepository, QuestionCategoryTestOnlineRepository, QuestionTestOnlineRepository, UserRepository } from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewQuestionTestOnline } from '../../inputs/CampusAdministrator/NewQuestionTestOnline';
import { IContext } from '../../interfaces/IContext';
import { QuestionCategoryTestOnline } from '../../models/CampusAdministrator/QuestionCategoryTestOnline';
import { QuestionTestOnline, QuestionTestOnlineConnection } from '../../models/CampusAdministrator/QuestionTestOnline';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { User } from '../../models/GeneralAdministrator/User';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(QuestionTestOnline)
export class QuestionTestOnlineResolver {
    @InjectRepository(QuestionTestOnline)
    private repository = QuestionTestOnlineRepository;

    @InjectRepository(User)
    private repositoryUser = UserRepository;

    @InjectRepository(Campus)
    private repositoryCampus = CampusRepository;

    @InjectRepository(QuestionCategoryTestOnline)
    private repositoryQuestionCategoryTestOnline = QuestionCategoryTestOnlineRepository;

    @Query(() => QuestionTestOnline, { nullable: true })
    async getQuestionTestOnline(@Arg('id', () => String) id: string) {
        const result = await this.repository.findOneBy(id);
        return result;
    }

    @Query(() => QuestionTestOnlineConnection)
    async getAllQuestionTestOnline(
        @Args() args: ConnectionArgs,
        @Arg('allData', () => Boolean) allData: Boolean,
        @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
        @Arg('campusId', () => String) campusId: String,
    ): Promise<QuestionTestOnlineConnection> {
        let result;
        if (allData) {
            if (orderCreated) {
                result = await this.repository.findBy({
                    where: {
                        campusId
                    },
                    order: { createdAt: 'DESC' },
                });
            } else {
                result = await this.repository.findBy({
                    where: {
                        campusId
                    },
                });
            }
        } else {
            if (orderCreated) {
                result = await this.repository.findBy({
                    where: {
                        campusId,
                        active: true,
                    },
                    order: { createdAt: 'DESC' },
                });
            } else {
                result = await this.repository.findBy({
                    where: {
                        campusId,
                        active: true,
                    },
                });
            }
        }
        let resultConn = new QuestionTestOnlineConnection();
        let resultConnection = connectionFromArraySlice(result, args, {
            sliceStart: 0,
            arrayLength: result.length,
        });
        resultConn = { ...resultConnection, totalCount: result.length };
        return resultConn;
    }

    @Mutation(() => QuestionTestOnline)
    async createQuestionTestOnline(
        @Arg('data') data: NewQuestionTestOnline,
        @Ctx() context: IContext
    ): Promise<QuestionTestOnline> {
        let dataProcess: NewQuestionTestOnline = removeEmptyStringElements(data);
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

    @Mutation(() => QuestionTestOnline)
    async updateQuestionTestOnline(
        @Arg('data') data: NewQuestionTestOnline,
        @Arg('id', () => String) id: string,
        @Ctx() context: IContext
    ): Promise<QuestionTestOnline | null> {
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
    async changeActiveQuestionTestOnline(
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
    async deleteQuestionTestOnline(
        @Arg('id', () => String) id: string,
        @Ctx() context: IContext
    ): Promise<Boolean | null> {
        let data = await this.repository.findOneBy(id);
        let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
        return result?.result?.ok === 1 ?? true;
    }

    @FieldResolver((_type) => User, { nullable: true })
    async createdByUser(@Root() data: QuestionTestOnline) {
        let id = data.createdByUserId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryUser.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => User, { nullable: true })
    async updatedByUser(@Root() data: QuestionTestOnline) {
        let id = data.updatedByUserId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryUser.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => Campus, { nullable: true })
    async campus(@Root() data: QuestionTestOnline) {
        let id = data.campusId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryCampus.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => QuestionCategoryTestOnline, { nullable: true })
    async questionCategoryTestOnline(@Root() data: QuestionTestOnline) {
        let id = data.questionCategoryTestOnlineId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryQuestionCategoryTestOnline.findOneBy(id);
            return result;
        }
        return null;
    }
}
