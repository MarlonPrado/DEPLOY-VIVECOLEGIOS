import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { CampusRepository, EvidenceLearningRepository, ExperienceLearningRepository, ExperienceLearningRubricCriteriaRepository, UserRepository } from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewExperienceLearningRubricCriteria } from '../../inputs/CampusAdministrator/NewExperienceLearningRubricCriteria';
import { IContext } from '../../interfaces/IContext';
import { ExperienceLearning } from '../../models/CampusAdministrator/ExperienceLearning';
import { ExperienceLearningRubricCriteria, ExperienceLearningRubricCriteriaConnection } from '../../models/CampusAdministrator/ExperienceLearningRubricCriteria';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { User } from '../../models/GeneralAdministrator/User';
import { EvidenceLearning } from '../../models/SchoolAdministrator/EvidenceLearning';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(ExperienceLearningRubricCriteria)
export class ExperienceLearningRubricCriteriaResolver {
    @InjectRepository(ExperienceLearningRubricCriteria)
    private repository = ExperienceLearningRubricCriteriaRepository;

    @InjectRepository(User)
    private repositoryUser = UserRepository;

    @InjectRepository(Campus)
    private repositoryCampus = CampusRepository;

    @InjectRepository(ExperienceLearning)
    private repositoryExperienceLearning = ExperienceLearningRepository;

    @InjectRepository(EvidenceLearning)
    private repositoryEvidenceLearning = EvidenceLearningRepository;

    @Query(() => ExperienceLearningRubricCriteria, { nullable: true })
    async getExperienceLearningRubricCriteria(@Arg('id', () => String) id: string) {
        const result = await this.repository.findOneBy(id);
        return result;
    }

    @Query(() => ExperienceLearningRubricCriteriaConnection)
    async getAllExperienceLearningRubricCriteria(
        @Args() args: ConnectionArgs,
        @Arg('allData', () => Boolean) allData: Boolean,
        @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
        @Arg('experienceLearningId', () => String) experienceLearningId: String
    ): Promise<ExperienceLearningRubricCriteriaConnection> {
        let result;
        if (allData) {
            if (orderCreated) {
                result = await this.repository.findBy({
                    where: {
                        experienceLearningId,
                    },
                    order: { createdAt: 'DESC' },
                });
            } else {
                result = await this.repository.findBy({
                    where: {
                        experienceLearningId,
                    },
                });
            }
        } else {
            if (orderCreated) {
                result = await this.repository.findBy({
                    where: {
                        experienceLearningId,
                        active: true,
                    },
                    order: { createdAt: 'DESC' },
                });

            } else {
                result = await this.repository.findBy({
                    where: {
                        experienceLearningId,
                        active: true,
                    },
                });
            }
        }
        let resultConn = new ExperienceLearningRubricCriteriaConnection();
        let resultConnection = connectionFromArraySlice(result, args, {
            sliceStart: 0,
            arrayLength: result.length,
        });
        resultConn = { ...resultConnection, totalCount: result.length };
        return resultConn;
    }

    @Mutation(() => ExperienceLearningRubricCriteria)
    async createExperienceLearningRubricCriteria(@Arg('data') data: NewExperienceLearningRubricCriteria, @Ctx() context: IContext): Promise<ExperienceLearningRubricCriteria> {
        let dataProcess: NewExperienceLearningRubricCriteria = removeEmptyStringElements(data);
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

    @Mutation(() => ExperienceLearningRubricCriteria)
    async updateExperienceLearningRubricCriteria(
        @Arg('data') data: NewExperienceLearningRubricCriteria,
        @Arg('id', () => String) id: string,
        @Ctx() context: IContext
    ): Promise<ExperienceLearningRubricCriteria | null> {
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
    async changeActiveExperienceLearningRubricCriteria(
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
    async deleteExperienceLearningRubricCriteria(
        @Arg('id', () => String) id: string,
        @Ctx() context: IContext
    ): Promise<Boolean | null> {
        let data = await this.repository.findOneBy(id);
        let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
        return result?.result?.ok === 1 ?? true;
    }

    @FieldResolver((_type) => User, { nullable: true })
    async createdByUser(@Root() data: ExperienceLearningRubricCriteria) {
        let id = data.createdByUserId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryUser.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => User, { nullable: true })
    async updatedByUser(@Root() data: ExperienceLearningRubricCriteria) {
        let id = data.updatedByUserId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryUser.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => Campus, { nullable: true })
    async campus(@Root() data: ExperienceLearningRubricCriteria) {
        let id = data.campusId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryCampus.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => ExperienceLearning, { nullable: true })
    async experienceLearning(@Root() data: ExperienceLearningRubricCriteria) {
        let id = data.experienceLearningId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryExperienceLearning.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => EvidenceLearning, { nullable: true })
    async evidenceLearnig(@Root() data: ExperienceLearningRubricCriteria) {
        let id = data.evidenceLearningId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryEvidenceLearning.findOneBy(id);
            return result;
        }
        return null;
    }

}
