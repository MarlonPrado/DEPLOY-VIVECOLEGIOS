import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { AcademicAreaCoursePeriodValuationRepository, AcademicAreaRepository, AcademicPeriodRepository, CampusRepository, PerformanceLevelRepository, StudentRepository, UserRepository } from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewAcademicAreaCoursePeriodValuation } from '../../inputs/CampusAdministrator/NewAcademicAreaCoursePeriodValuation';
import { IContext } from '../../interfaces/IContext';
import { AcademicAreaCoursePeriodValuation, AcademicAreaCoursePeriodValuationConnection } from '../../models/CampusAdministrator/AcademicAreaCoursePeriodValuation';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { Student } from '../../models/GeneralAdministrator/Student';
import { User } from '../../models/GeneralAdministrator/User';
import { AcademicArea } from '../../models/SchoolAdministrator/AcademicArea';
import { AcademicPeriod } from '../../models/SchoolAdministrator/AcademicPeriod';
import { PerformanceLevel } from '../../models/SchoolAdministrator/PerformanceLevel';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(AcademicAreaCoursePeriodValuation)
export class AcademicAreaCoursePeriodValuationResolver {
    @InjectRepository(AcademicAreaCoursePeriodValuation)
    private repository = AcademicAreaCoursePeriodValuationRepository;

    @InjectRepository(User)
    private repositoryUser = UserRepository;

    @InjectRepository(Campus)
    private repositoryCampus = CampusRepository;

    @InjectRepository(AcademicArea)
    private repositoryAcademicArea = AcademicAreaRepository;

    @InjectRepository(AcademicPeriod)
    private repositoryAcademicPeriod = AcademicPeriodRepository;

    @InjectRepository(Student)
    private repositoryStudent = StudentRepository;

    @InjectRepository(PerformanceLevel)
    private repositoryPerformanceLevel = PerformanceLevelRepository;

    @Query(() => AcademicAreaCoursePeriodValuation, { nullable: true })
    async getAcademicAreaCoursePeriodValuation(@Arg('id', () => String) id: string) {
        console.log(`getAcademicAreaCoursePeriodValuation called with id: ${id}`);
        const result = await this.repository.findOneBy(id);
        console.log(`Result: ${JSON.stringify(result)}`);
        return result;
    }

    @Query(() => AcademicAreaCoursePeriodValuationConnection)
    async getAllAcademicAreaCoursePeriodValuation(
        @Args() args: ConnectionArgs,
        @Arg('allData', () => Boolean) allData: Boolean,
        @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
        @Arg('academicAreaId', () => String) academicAreaId: String,
        @Arg('academicPeriodId', () => String) academicPeriodId: String,
        @Arg('studentId', () => String, { nullable: true }) studentId: String,
    ): Promise<AcademicAreaCoursePeriodValuationConnection> {
        console.log(`getAllAcademicAreaCoursePeriodValuation called with args: ${JSON.stringify(args)}, allData: ${allData}, orderCreated: ${orderCreated}, academicAreaId: ${academicAreaId}, academicPeriodId: ${academicPeriodId}, studentId: ${studentId}`);
        let result;
        if (allData) {
            if (orderCreated) {
                if (academicAreaId && academicPeriodId && studentId) {
                    result = await this.repository.findBy({
                        where: {
                            academicAreaId,
                            academicPeriodId,
                            studentId
                        },
                        order: { createdAt: 'DESC' },
                    });
                } else {
                    result = await this.repository.findBy({
                        where: {
                            academicAreaId,
                            academicPeriodId,
                        },
                        order: { createdAt: 'DESC' },
                    });
                }
            } else {
                if (academicAreaId && academicPeriodId && studentId) {
                    result = await this.repository.findBy({
                        where: {
                            academicAreaId,
                            academicPeriodId,
                            studentId
                        },
                    });
                } else {
                    result = await this.repository.findBy({
                        where: {
                            academicAreaId,
                            academicPeriodId,
                        },
                    });
                }
            }
        } else {
            if (orderCreated) {
                if (academicAreaId && academicPeriodId && studentId) {
                    result = await this.repository.findBy({
                        where: {
                            academicAreaId,
                            academicPeriodId,
                            studentId,
                            active: true,
                        },
                        order: { createdAt: 'DESC' },
                    });
                } else {
                    result = await this.repository.findBy({
                        where: {
                            academicAreaId,
                            academicPeriodId,
                            active: true,
                        },
                        order: { createdAt: 'DESC' },
                    });
                }
            } else {
                if (academicAreaId && academicPeriodId && studentId) {
                    result = await this.repository.findBy({
                        where: {
                            academicAreaId,
                            academicPeriodId,
                            studentId,
                            active: true,
                        },
                    });
                } else {
                    result = await this.repository.findBy({
                        where: {
                            academicAreaId,
                            academicPeriodId,
                            active: true,
                        },
                    });
                }
            }
        }
        let resultConn = new AcademicAreaCoursePeriodValuationConnection();
        let resultConnection = connectionFromArraySlice(result, args, {
            sliceStart: 0,
            arrayLength: result.length,
        });
        resultConn = { ...resultConnection, totalCount: result.length };
        console.log(`Result Connection: ${JSON.stringify(resultConn)}`);
        return resultConn;
    }

    @Mutation(() => AcademicAreaCoursePeriodValuation)
    async createAcademicAreaCoursePeriodValuation(
        @Arg('data') data: NewAcademicAreaCoursePeriodValuation,
        @Ctx() context: IContext
    ): Promise<AcademicAreaCoursePeriodValuation> {
        console.log(`createAcademicAreaCoursePeriodValuation called with data: ${JSON.stringify(data)}`);
        let dataProcess: NewAcademicAreaCoursePeriodValuation = removeEmptyStringElements(data);
        let createdByUserId = context?.user?.authorization?.id;
        const model = await this.repository.create({
            ...dataProcess,
            active: true,
            version: 0,
            createdByUserId,
        });
        let result = await this.repository.save(model);
        console.log(`Created Result: ${JSON.stringify(result)}`);
        return result;
    }

    @Mutation(() => AcademicAreaCoursePeriodValuation)
    async updateAcademicAreaCoursePeriodValuation(
        @Arg('data') data: NewAcademicAreaCoursePeriodValuation,
        @Arg('id', () => String) id: string,
        @Ctx() context: IContext
    ): Promise<AcademicAreaCoursePeriodValuation | null> {
        console.log(`updateAcademicAreaCoursePeriodValuation called with id: ${id} and data: ${JSON.stringify(data)}`);
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
        console.log(`Updated Result: ${JSON.stringify(result)}`);
        return result;
    }

    @Mutation(() => Boolean)
    async changeActiveAcademicAreaCoursePeriodValuation(
        @Arg('active', () => Boolean) active: boolean,
        @Arg('id', () => String) id: string,
        @Ctx() context: IContext
    ): Promise<Boolean | null> {
        console.log(`changeActiveAcademicAreaCoursePeriodValuation called with id: ${id} and active: ${active}`);
        let updatedByUserId = context?.user?.authorization?.id;
        let result = await this.repository.findOneBy(id);
        result = await this.repository.save({
            _id: new ObjectId(id),
            ...result,
            active: active,
            version: (result?.version as number) + 1,
            updatedByUserId,
        });
        console.log(`Change Active Result: ${JSON.stringify(result)}`);
        return result.id ? true : false;
    }

    @Mutation(() => Boolean)
    async deleteAcademicAreaCoursePeriodValuation(
        @Arg('id', () => String) id: string,
        @Ctx() context: IContext
    ): Promise<Boolean | null> {
        console.log(`deleteAcademicAreaCoursePeriodValuation called with id: ${id}`);
        let data = await this.repository.findOneBy(id);
        let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
        console.log(`Delete Result: ${JSON.stringify(result)}`);
        return result?.result?.ok === 1;
    }

    @FieldResolver((_type) => User, { nullable: true })
    async createdByUser(@Root() data: AcademicAreaCoursePeriodValuation) {
        let id = data.createdByUserId;
        console.log(`createdByUser called with id: ${id}`);
        if (id !== null && id !== undefined) {
            const result = await this.repositoryUser.findOneBy(id);
            console.log(`Created By User Result: ${JSON.stringify(result)}`);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => User, { nullable: true })
    async updatedByUser(@Root() data: AcademicAreaCoursePeriodValuation) {
        let id = data.updatedByUserId;
        console.log(`updatedByUser called with id: ${id}`);
        if (id !== null && id !== undefined) {
            const result = await this.repositoryUser.findOneBy(id);
            console.log(`Updated By User Result: ${JSON.stringify(result)}`);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => Campus, { nullable: true })
    async campus(@Root() data: AcademicAreaCoursePeriodValuation) {
        let id = data.campusId;
        console.log(`campus called with id: ${id}`);
        if (id !== null && id !== undefined) {
            const result = await this.repositoryCampus.findOneBy(id);
            console.log(`Campus Result: ${JSON.stringify(result)}`);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => AcademicArea, { nullable: true })
    async academicAsignatureCourse(@Root() data: AcademicAreaCoursePeriodValuation) {
        let id = data.academicAreaId;
        console.log(`academicAsignatureCourse called with id: ${id}`);
        if (id !== null && id !== undefined) {
            const result = await this.repositoryAcademicArea.findOneBy(id);
            console.log(`Academic Asignature Course Result: ${JSON.stringify(result)}`);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => AcademicPeriod, { nullable: true })
    async academicPeriod(@Root() data: AcademicAreaCoursePeriodValuation) {
        let id = data.academicPeriodId;
        console.log(`academicPeriod called with id: ${id}`);
        if (id !== null && id !== undefined) {
            const result = await this.repositoryAcademicPeriod.findOneBy(id);
            console.log(`Academic Period Result: ${JSON.stringify(result)}`);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => Student, { nullable: true })
    async student(@Root() data: AcademicAreaCoursePeriodValuation) {
        let id = data.studentId;
        console.log(`student called with id: ${id}`);
        if (id !== null && id !== undefined) {
            const result = await this.repositoryStudent.findOneBy(id);
            console.log(`Student Result: ${JSON.stringify(result)}`);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => PerformanceLevel, { nullable: true })
    async performanceLevel(@Root() data: AcademicAreaCoursePeriodValuation) {
        let id = data.performanceLevelId;
        console.log(`performanceLevel called with id: ${id}`);
        if (id !== null && id !== undefined) {
            const result = await this.repositoryPerformanceLevel.findOneBy(id);
            console.log(`Performance Level Result: ${JSON.stringify(result)}`);
            return result;
        }
        return null;
    }
}
