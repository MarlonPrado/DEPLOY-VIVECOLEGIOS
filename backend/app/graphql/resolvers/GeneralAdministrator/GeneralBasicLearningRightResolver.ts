import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { GeneralAcademicAsignatureRepository, GeneralAcademicGradeRepository, GeneralBasicLearningRightRepository, UserRepository } from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewGeneralBasicLearningRight } from '../../inputs/GeneralAdministrator/NewGeneralBasicLearningRight';
import { IContext } from '../../interfaces/IContext';
import { GeneralAcademicAsignature } from '../../models/GeneralAdministrator/GeneralAcademicAsignature';
import { GeneralAcademicGrade } from '../../models/GeneralAdministrator/GeneralAcademicGrade';
import {
    GeneralBasicLearningRight,
    GeneralBasicLearningRightConnection
} from '../../models/GeneralAdministrator/GeneralBasicLearningRight';
import { User } from '../../models/GeneralAdministrator/User';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(GeneralBasicLearningRight)
export class GeneralBasicLearningRightResolver {
    @InjectRepository(GeneralBasicLearningRight)
    private repository = GeneralBasicLearningRightRepository;

    @InjectRepository(User)
    private repositoryUser = UserRepository;

    @InjectRepository(GeneralAcademicAsignature)
    private repositoryGeneralAcademicAsignature = GeneralAcademicAsignatureRepository;

    @InjectRepository(GeneralAcademicGrade)
    private repositoryGeneralAcademicGrade = GeneralAcademicGradeRepository;

    @Query(() => GeneralBasicLearningRight, { nullable: true })
    async getGeneralBasicLearningRight(@Arg('id', () => String) id: string) {
        const result = await this.repository.findOneBy(id);
        return result;
    }

    @Query(() => GeneralBasicLearningRightConnection)
    async getAllGeneralBasicLearningRight(
        @Args() args: ConnectionArgs,
        @Arg('allData', () => Boolean) allData: Boolean,
        @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
        @Arg('generalAcademicAsignatureId', () => String, { nullable: true }) generalAcademicAsignatureId: string,
        @Arg('generalAcademicGradeId', () => String, { nullable: true }) generalAcademicGradeId: string,
    ): Promise<GeneralBasicLearningRightConnection> {
        let result;
        if (allData) {
            if (orderCreated) {
                if (generalAcademicAsignatureId && generalAcademicGradeId) {
                    result = await this.repository.findBy({
                        where: { generalAcademicAsignatureId, generalAcademicGradeId },
                        order: { createdAt: 'DESC' },
                    });
                } else {
                    if (generalAcademicAsignatureId) {
                        result = await this.repository.findBy({
                            where: { generalAcademicAsignatureId },
                            order: { createdAt: 'DESC' },
                        });
                    } else {
                        result = await this.repository.findBy({
                            where: { generalAcademicGradeId },
                            order: { createdAt: 'DESC' },
                        });
                    }
                }
            } else {
                if (generalAcademicAsignatureId && generalAcademicGradeId) {
                    result = await this.repository.findBy({
                        where: { generalAcademicAsignatureId, generalAcademicGradeId },
                    });
                } else {
                    if (generalAcademicAsignatureId) {
                        result = await this.repository.findBy({
                            where: { generalAcademicAsignatureId },
                        });
                    } else {
                        result = await this.repository.findBy({
                            where: { generalAcademicGradeId },
                        });
                    }
                }
            }
        } else {
            if (orderCreated) {
                if (generalAcademicAsignatureId && generalAcademicGradeId) {
                    result = await this.repository.findBy({
                        where: {
                            generalAcademicAsignatureId, generalAcademicGradeId, active: true,
                        },
                        order: { createdAt: 'DESC' },
                    });
                } else {
                    if (generalAcademicAsignatureId) {
                        result = await this.repository.findBy({
                            where: {
                                generalAcademicAsignatureId, active: true,
                            },
                            order: { createdAt: 'DESC' },
                        });
                    } else {
                        result = await this.repository.findBy({
                            where: {
                                generalAcademicGradeId, active: true,
                            },
                            order: { createdAt: 'DESC' },
                        });
                    }
                }
            } else {
                if (generalAcademicAsignatureId && generalAcademicGradeId) {
                    result = await this.repository.findBy({
                        where: {
                            generalAcademicAsignatureId, generalAcademicGradeId, active: true,
                        },
                    });
                } else {
                    if (generalAcademicAsignatureId) {
                        result = await this.repository.findBy({
                            where: {
                                generalAcademicAsignatureId, active: true,
                            },
                        });
                    } else {
                        result = await this.repository.findBy({
                            where: {
                                generalAcademicGradeId, active: true,
                            },
                        });
                    }
                }
            }
        }
        let resultConn = new GeneralBasicLearningRightConnection();
        let resultConnection = connectionFromArraySlice(result, args, {
            sliceStart: 0,
            arrayLength: result.length,
        });
        resultConn = { ...resultConnection, totalCount: result.length };
        return resultConn;
    }

    @Mutation(() => GeneralBasicLearningRight)
    async createGeneralBasicLearningRight(
        @Arg('data') data: NewGeneralBasicLearningRight,
        @Ctx() context: IContext
    ): Promise<GeneralBasicLearningRight> {
        let dataProcess: NewGeneralBasicLearningRight = removeEmptyStringElements(data);
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

    @Mutation(() => GeneralBasicLearningRight)
    async updateGeneralBasicLearningRight(
        @Arg('data') data: NewGeneralBasicLearningRight,
        @Arg('id', () => String) id: string,
        @Ctx() context: IContext
    ): Promise<GeneralBasicLearningRight | null> {
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
    async changeActiveGeneralBasicLearningRight(
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
    async deleteGeneralBasicLearningRight(
        @Arg('id', () => String) id: string,
        @Ctx() context: IContext
    ): Promise<Boolean | null> {
        let data = await this.repository.findOneBy(id);
        let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
        return result?.result?.ok === 1 ?? true;
    }

    @FieldResolver((_type) => User, { nullable: true })
    async createdByUser(@Root() data: GeneralBasicLearningRight) {
        let id = data.createdByUserId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryUser.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => User, { nullable: true })
    async updatedByUser(@Root() data: GeneralBasicLearningRight) {
        let id = data.updatedByUserId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryUser.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => GeneralAcademicAsignature, { nullable: true })
    async generalAcademicAsignature(@Root() data: GeneralBasicLearningRight) {
        let id = data.generalAcademicAsignatureId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryGeneralAcademicAsignature.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => GeneralAcademicGrade, { nullable: true })
    async generalAcademicGrade(@Root() data: GeneralBasicLearningRight) {
        let id = data.generalAcademicGradeId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryGeneralAcademicGrade.findOneBy(id);
            return result;
        }
        return null;
    }
}
