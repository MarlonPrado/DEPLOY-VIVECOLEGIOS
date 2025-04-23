import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { CampusRepository, QuestionBankTestOnlineRepository, QuestionCategoryTestOnlineRepository, UserRepository } from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewQuestionCategoryTestOnline } from '../../inputs/CampusAdministrator/NewQuestionCategoryTestOnline';
import { IContext } from '../../interfaces/IContext';
import { QuestionBankTestOnline } from '../../models/CampusAdministrator/QuestionBankTestOnline';
import { QuestionCategoryTestOnline, QuestionCategoryTestOnlineConnection } from '../../models/CampusAdministrator/QuestionCategoryTestOnline';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { User } from '../../models/GeneralAdministrator/User';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(QuestionCategoryTestOnline)
export class QuestionCategoryTestOnlineResolver {
    @InjectRepository(QuestionCategoryTestOnline)
    private repository = QuestionCategoryTestOnlineRepository;

    @InjectRepository(User)
    private repositoryUser = UserRepository;

    @InjectRepository(Campus)
    private repositoryCampus = CampusRepository;

    @InjectRepository(QuestionBankTestOnline)
    private repositoryQuestionBankTestOnline = QuestionBankTestOnlineRepository;

    @Query(() => QuestionCategoryTestOnline, { nullable: true })
    async getQuestionCategoryTestOnline(@Arg('id', () => String) id: string) {
        const result = await this.repository.findOneBy(id);
        return result;
    }

    @Query(() => QuestionCategoryTestOnlineConnection)
    async getAllQuestionCategoryTestOnline(
        @Args() args: ConnectionArgs,
        @Arg('allData', () => Boolean) allData: Boolean,
        @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
        @Arg('campusId', () => String) campusId: String,
    ): Promise<QuestionCategoryTestOnlineConnection> {
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
        let resultConn = new QuestionCategoryTestOnlineConnection();
        let resultConnection = connectionFromArraySlice(result, args, {
            sliceStart: 0,
            arrayLength: result.length,
        });
        resultConn = { ...resultConnection, totalCount: result.length };
        return resultConn;
    }

    @Mutation(() => QuestionCategoryTestOnline)
    async createQuestionCategoryTestOnline(
        @Arg('data') data: NewQuestionCategoryTestOnline,
        @Ctx() context: IContext
    ): Promise<QuestionCategoryTestOnline> {
        let dataProcess: NewQuestionCategoryTestOnline = removeEmptyStringElements(data);
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

    @Mutation(() => QuestionCategoryTestOnline)
    async updateQuestionCategoryTestOnline(
        @Arg('data') data: NewQuestionCategoryTestOnline,
        @Arg('id', () => String) id: string,
        @Ctx() context: IContext
    ): Promise<QuestionCategoryTestOnline | null> {
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
    async changeActiveQuestionCategoryTestOnline(
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
    async deleteQuestionCategoryTestOnline(
        @Arg('id', () => String) id: string,
        @Ctx() context: IContext
    ): Promise<Boolean | null> {
        let data = await this.repository.findOneBy(id);
        let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
        return result?.result?.ok === 1 ?? true;
    }

    @FieldResolver((_type) => User, { nullable: true })
    async createdByUser(@Root() data: QuestionCategoryTestOnline) {
        let id = data.createdByUserId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryUser.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => User, { nullable: true })
    async updatedByUser(@Root() data: QuestionCategoryTestOnline) {
        let id = data.updatedByUserId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryUser.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => Campus, { nullable: true })
    async campus(@Root() data: QuestionCategoryTestOnline) {
        let id = data.campusId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryCampus.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => QuestionBankTestOnline, { nullable: true })
    async questionBankTestOnline(@Root() data: QuestionCategoryTestOnline) {
        let id = data.questionBankTestOnlineId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryQuestionBankTestOnline.findOneBy(id);
            return result;
        }
        return null;
    }
}
