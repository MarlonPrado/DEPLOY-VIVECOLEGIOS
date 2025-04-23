import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { EvidenceLearningRepository, LearningRepository, SchoolRepository, UserRepository } from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewEvidenceLearning } from '../../inputs/SchoolAdministrator/NewEvidenceLearning';
import { IContext } from '../../interfaces/IContext';
import { School } from '../../models/GeneralAdministrator/School';
import { User } from '../../models/GeneralAdministrator/User';
import {
    EvidenceLearning,
    EvidenceLearningConnection
} from '../../models/SchoolAdministrator/EvidenceLearning';
import { Learning } from '../../models/SchoolAdministrator/Learning';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(EvidenceLearning)
export class EvidenceLearningResolver {
    @InjectRepository(EvidenceLearning)
    private repository = EvidenceLearningRepository;

    @InjectRepository(User)
    private repositoryUser = UserRepository;

    @InjectRepository(Learning)
    private repositoryLearning = LearningRepository;

    @InjectRepository(School)
    private repositorySchool = SchoolRepository;

    @Query(() => EvidenceLearning, { nullable: true })
    async getEvidenceLearning(@Arg('id', () => String) id: string) {
        const result = await this.repository.findOneBy(id);
        return result;
    }

    @Query(() => EvidenceLearningConnection)
    async getAllEvidenceLearning(
        @Args() args: ConnectionArgs,
        @Arg('allData', () => Boolean) allData: Boolean,
        @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
        @Arg('schoolId', () => String) schoolId: string,
        @Arg('learningId', () => String, { nullable: true }) learningId: string,
    ): Promise<EvidenceLearningConnection> {
        let result;
        if (allData) {
            if (orderCreated) {
                if (learningId) {
                    result = await this.repository.findBy({
                        where: { schoolId, learningId },
                        order: { createdAt: 'DESC' },
                    });
                }
                else {
                    result = await this.repository.findBy({
                        where: { schoolId },
                        order: { createdAt: 'DESC' },
                    });
                }
            } else {
                if (learningId) {
                    result = await this.repository.findBy({ where: { schoolId, learningId } });
                }
                else {
                    result = await this.repository.findBy({ where: { schoolId } });
                }
            }
        } else {
            if (orderCreated) {
                if (learningId) {
                    result = await this.repository.findBy({
                        where: {
                            schoolId,
                            learningId,
                            active: true,
                        },
                        order: { createdAt: 'DESC' },
                    });
                }
                else {
                    result = await this.repository.findBy({
                        where: {
                            schoolId,
                            active: true,
                        },
                        order: { createdAt: 'DESC' },
                    });
                }
            } else {
                if (learningId) {
                    result = await this.repository.findBy({
                        where: {
                            schoolId,
                            learningId,
                            active: true,
                        },
                    });
                }
                else {
                    result = await this.repository.findBy({
                        where: {
                            schoolId,
                            active: true,
                        },
                    });
                }
            }
        }
        let resultConn = new EvidenceLearningConnection();
        let resultConnection = connectionFromArraySlice(result, args, {
            sliceStart: 0,
            arrayLength: result.length,
        });
        resultConn = { ...resultConnection, totalCount: result.length };
        return resultConn;
    }

    @Query(() => EvidenceLearningConnection)
    async getAllEvidenceLearningLearnigs(
        @Args() args: ConnectionArgs,
        @Arg('learningsId', () => [String], { nullable: true }) learningsId: [string],
    ): Promise<EvidenceLearningConnection> {
        let result;
        result = await this.repository.findBy({
            where: { learningId: { $in: learningsId }, active: true },
        });
        let resultConn = new EvidenceLearningConnection();
        let resultConnection = connectionFromArraySlice(result, args, {
            sliceStart: 0,
            arrayLength: result.length,
        });
        resultConn = { ...resultConnection, totalCount: result.length };
        return resultConn;
    }

    @Mutation(() => EvidenceLearning)
    async createEvidenceLearning(
        @Arg('data') data: NewEvidenceLearning,
        @Ctx() context: IContext
    ): Promise<EvidenceLearning> {
        let dataProcess: NewEvidenceLearning = removeEmptyStringElements(data);
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

    @Mutation(() => EvidenceLearning)
    async updateEvidenceLearning(
        @Arg('data') data: NewEvidenceLearning,
        @Arg('id', () => String) id: string,
        @Ctx() context: IContext
    ): Promise<EvidenceLearning | null> {
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
    async changeActiveEvidenceLearning(
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
    async deleteEvidenceLearning(
        @Arg('id', () => String) id: string,
        @Ctx() context: IContext
    ): Promise<Boolean | null> {
        let data = await this.repository.findOneBy(id);
        let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
        return result?.result?.ok === 1 ?? true;
    }

    @FieldResolver((_type) => User, { nullable: true })
    async createdByUser(@Root() data: EvidenceLearning) {
        let id = data.createdByUserId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryUser.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => User, { nullable: true })
    async updatedByUser(@Root() data: EvidenceLearning) {
        let id = data.updatedByUserId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryUser.findOneBy(id);
            return result;
        }
        return null;
    }


    @FieldResolver((_type) => Learning, { nullable: true })
    async academicStandard(@Root() data: EvidenceLearning) {
        let id = data.learningId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryLearning.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => School, { nullable: true })
    async school(@Root() data: EvidenceLearning) {
        let id = data.schoolId;
        if (id !== null && id !== undefined) {
            const result = await this.repositorySchool.findOneBy(id);
            return result;
        }
        return null;
    }
}
