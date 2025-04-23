import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { AcademicAsignatureCoursePeriodValuationRepository, AcademicAsignatureCourseRepository, AcademicPeriodRepository, CampusRepository, PerformanceLevelRepository, StudentRepository, UserRepository } from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewAcademicAsignatureCoursePeriodValuation } from '../../inputs/CampusAdministrator/NewAcademicAsignatureCoursePeriodValuation';
import { IContext } from '../../interfaces/IContext';
import { AcademicAsignatureCourse } from '../../models/CampusAdministrator/AcademicAsignatureCourse';
import { AcademicAsignatureCoursePeriodValuation, AcademicAsignatureCoursePeriodValuationConnection } from '../../models/CampusAdministrator/AcademicAsignatureCoursePeriodValuation';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { Student } from '../../models/GeneralAdministrator/Student';
import { User } from '../../models/GeneralAdministrator/User';
import { AcademicPeriod } from '../../models/SchoolAdministrator/AcademicPeriod';
import { PerformanceLevel } from '../../models/SchoolAdministrator/PerformanceLevel';
import { ConnectionArgs } from '../../pagination/relaySpecs';
console.log("Asignatura de Evaluacion de Periodo respecto al cursoacademicor");

@Resolver(AcademicAsignatureCoursePeriodValuation)
export class AcademicAsignatureCoursePeriodValuationResolver {
    @InjectRepository(AcademicAsignatureCoursePeriodValuation)
    private repository = AcademicAsignatureCoursePeriodValuationRepository;

    @InjectRepository(User)
    private repositoryUser = UserRepository;

    @InjectRepository(Campus)
    private repositoryCampus = CampusRepository;

    @InjectRepository(AcademicAsignatureCourse)
    private repositoryAcademicAsignatureCourse = AcademicAsignatureCourseRepository;

    @InjectRepository(AcademicPeriod)
    private repositoryAcademicPeriod = AcademicPeriodRepository;

    @InjectRepository(Student)
    private repositoryStudent = StudentRepository;

    @InjectRepository(PerformanceLevel)
    private repositoryPerformanceLevel = PerformanceLevelRepository;

    @Query(() => AcademicAsignatureCoursePeriodValuation, { nullable: true })
    async getAcademicAsignatureCoursePeriodValuation(@Arg('id', () => String) id: string) {
        console.log('[GET] AcademicAsignatureCoursePeriodValuation called with id:', id);
        const result = await this.repository.findOneBy(id);
        console.log('[GET] Result:', JSON.stringify(result, null, 2));
        return result;
    }

    @Query(() => AcademicAsignatureCoursePeriodValuationConnection)
    async getAllAcademicAsignatureCoursePeriodValuation(
        @Args() args: ConnectionArgs,
        @Arg('allData', () => Boolean) allData: Boolean,
        @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
        @Arg('academicAsignatureCourseId', () => String) academicAsignatureCourseId: String,
        @Arg('academicPeriodId', () => String) academicPeriodId: String,
        @Arg('studentId', () => String, { nullable: true }) studentId: String,
    ): Promise<AcademicAsignatureCoursePeriodValuationConnection> {
        console.log('[GET ALL] Params:', {
            args,
            allData,
            orderCreated,
            academicAsignatureCourseId,
            academicPeriodId,
            studentId
        });

        let result;
        if (allData) {
            console.log('[GET ALL] Fetching all data (including inactive)');
            if (orderCreated) {
                console.log('[GET ALL] Ordered by creation date DESC');
                if (academicAsignatureCourseId && academicPeriodId && studentId) {
                    console.log('[GET ALL] Filtering by academicAsignatureCourseId, academicPeriodId AND studentId');
                    result = await this.repository.findBy({
                        where: {
                            academicAsignatureCourseId,
                            academicPeriodId,
                            studentId
                        },
                        order: { createdAt: 'DESC' },
                    });
                } else {
                    console.log('[GET ALL] Filtering by academicAsignatureCourseId AND academicPeriodId only');
                    result = await this.repository.findBy({
                        where: {
                            academicAsignatureCourseId,
                            academicPeriodId,
                        },
                        order: { createdAt: 'DESC' },
                    });
                }
            } else {
                console.log('[GET ALL] No ordering specified');
                if (academicAsignatureCourseId && academicPeriodId && studentId) {
                    console.log('[GET ALL] Filtering by academicAsignatureCourseId, academicPeriodId AND studentId');
                    result = await this.repository.findBy({
                        where: {
                            academicAsignatureCourseId,
                            academicPeriodId,
                            studentId
                        },
                    });
                } else {
                    console.log('[GET ALL] Filtering by academicAsignatureCourseId AND academicPeriodId only');
                    result = await this.repository.findBy({
                        where: {
                            academicAsignatureCourseId,
                            academicPeriodId,
                        },
                    });
                }
            }
        } else {
            console.log('[GET ALL] Fetching only active data');
            if (orderCreated) {
                console.log('[GET ALL] Ordered by creation date DESC');
                if (academicAsignatureCourseId && academicPeriodId && studentId) {
                    console.log('[GET ALL] Filtering active by academicAsignatureCourseId, academicPeriodId AND studentId');
                    result = await this.repository.findBy({
                        where: {
                            academicAsignatureCourseId,
                            academicPeriodId,
                            studentId,
                            active: true,
                        },
                        order: { createdAt: 'DESC' },
                    });
                } else {
                    console.log('[GET ALL] Filtering active by academicAsignatureCourseId AND academicPeriodId only');
                    result = await this.repository.findBy({
                        where: {
                            academicAsignatureCourseId,
                            academicPeriodId,
                            active: true,
                        },
                        order: { createdAt: 'DESC' },
                    });
                }
            } else {
                console.log('[GET ALL] No ordering specified');
                if (academicAsignatureCourseId && academicPeriodId && studentId) {
                    console.log('[GET ALL] Filtering active by academicAsignatureCourseId, academicPeriodId AND studentId');
                    result = await this.repository.findBy({
                        where: {
                            academicAsignatureCourseId,
                            academicPeriodId,
                            studentId,
                            active: true,
                        },
                    });
                } else {
                    console.log('[GET ALL] Filtering active by academicAsignatureCourseId AND academicPeriodId only');
                    result = await this.repository.findBy({
                        where: {
                            academicAsignatureCourseId,
                            academicPeriodId,
                            active: true,
                        },
                    });
                }
            }
        }

        console.log(`[GET ALL] Found ${result.length} records`);
        if (result.length > 0) {
            console.log('[GET ALL] First record sample:', JSON.stringify(result[0], null, 2));
        }

        let resultConn = new AcademicAsignatureCoursePeriodValuationConnection();
        let resultConnection = connectionFromArraySlice(result, args, {
            sliceStart: 0,
            arrayLength: result.length,
        });
        resultConn = { ...resultConnection, totalCount: result.length };
        
        console.log('[GET ALL] Connection result:', {
            edges: resultConn.edges?.length,
            totalCount: resultConn.totalCount
        });
        
        return resultConn;
    }

    @Mutation(() => AcademicAsignatureCoursePeriodValuation)
    async createAcademicAsignatureCoursePeriodValuation(
        @Arg('data') data: NewAcademicAsignatureCoursePeriodValuation, 
        @Ctx() context: IContext
    ): Promise<AcademicAsignatureCoursePeriodValuation> {
        console.log('[CREATE] Input data:', JSON.stringify(data, null, 2));
        console.log('[CREATE] Context user:', context?.user?.authorization?.id);

        let dataProcess: NewAcademicAsignatureCoursePeriodValuation = removeEmptyStringElements(data);
        console.log('[CREATE] Processed data:', JSON.stringify(dataProcess, null, 2));

        let createdByUserId = context?.user?.authorization?.id;
        const model = await this.repository.create({
            ...dataProcess,
            active: true,
            version: 0,
            createdByUserId,
        });

        console.log('[CREATE] Model to save:', JSON.stringify(model, null, 2));

        let result = await this.repository.save(model);
        console.log('[CREATE] Saved result:', JSON.stringify(result, null, 2));
        
        return result;
    }

    @Mutation(() => AcademicAsignatureCoursePeriodValuation)
    async updateAcademicAsignatureCoursePeriodValuation(
        @Arg('data') data: NewAcademicAsignatureCoursePeriodValuation,
        @Arg('id', () => String) id: string,
        @Ctx() context: IContext
    ): Promise<AcademicAsignatureCoursePeriodValuation | null> {
        console.log('[UPDATE] ID:', id);
        console.log('[UPDATE] Input data:', JSON.stringify(data, null, 2));
        console.log('[UPDATE] Context user:', context?.user?.authorization?.id);

        let dataProcess = removeEmptyStringElements(data);
        console.log('[UPDATE] Processed data:', JSON.stringify(dataProcess, null, 2));

        let updatedByUserId = context?.user?.authorization?.id;
        let originalData = await this.repository.findOneBy(id);
        console.log('[UPDATE] Original data:', JSON.stringify(originalData, null, 2));

        let result = await this.repository.save({
            _id: new ObjectId(id),
            ...originalData,
            ...dataProcess,
            version: (originalData?.version as number) + 1,
            updatedByUserId,
        });

        console.log('[UPDATE] Result:', JSON.stringify(result, null, 2));
        return result;
    }

    @Mutation(() => Boolean)
    async changeActiveAcademicAsignatureCoursePeriodValuation(
        @Arg('active', () => Boolean) active: boolean,
        @Arg('id', () => String) id: string,
        @Ctx() context: IContext
    ): Promise<Boolean | null> {
        console.log('[CHANGE ACTIVE] ID:', id, 'Active:', active);
        console.log('[CHANGE ACTIVE] Context user:', context?.user?.authorization?.id);

        let updatedByUserId = context?.user?.authorization?.id;
        let originalData = await this.repository.findOneBy(id);
        console.log('[CHANGE ACTIVE] Original data:', JSON.stringify(originalData, null, 2));

        let result = await this.repository.save({
            _id: new ObjectId(id),
            ...originalData,
            active: active,
            version: (originalData?.version as number) + 1,
            updatedByUserId,
        });

        console.log('[CHANGE ACTIVE] Result:', JSON.stringify(result, null, 2));
        console.log('[CHANGE ACTIVE] Operation success:', result.id ? 'YES' : 'NO');
        
        return result.id ? true : false;
    }

    @Mutation(() => Boolean)
    async deleteAcademicAsignatureCoursePeriodValuation(
        @Arg('id', () => String) id: string,
        @Ctx() context: IContext
    ): Promise<Boolean | null> {
        console.log('[DELETE] ID:', id);
        console.log('[DELETE] Context user:', context?.user?.authorization?.id);

        let data = await this.repository.findOneBy(id);
        console.log('[DELETE] Data to delete:', JSON.stringify(data, null, 2));

        let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
        console.log('[DELETE] MongoDB result:', JSON.stringify(result, null, 2));
        console.log('[DELETE] Operation success:', result?.result?.ok === 1 ? 'YES' : 'NO');
        
        return result?.result?.ok === 1 ?? true;
    }

    @FieldResolver((_type) => User, { nullable: true })
    async createdByUser(@Root() data: AcademicAsignatureCoursePeriodValuation) {
        let id = data.createdByUserId;
        console.log('[FIELD] createdByUser for valuation:', data.id, 'User ID:', id);
        
        if (id !== null && id !== undefined) {
            const result = await this.repositoryUser.findOneBy(id);
            console.log('[FIELD] createdByUser result:', JSON.stringify(result, null, 2));
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => User, { nullable: true })
    async updatedByUser(@Root() data: AcademicAsignatureCoursePeriodValuation) {
        let id = data.updatedByUserId;
        console.log('[FIELD] updatedByUser for valuation:', data.id, 'User ID:', id);
        
        if (id !== null && id !== undefined) {
            const result = await this.repositoryUser.findOneBy(id);
            console.log('[FIELD] updatedByUser result:', JSON.stringify(result, null, 2));
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => Campus, { nullable: true })
    async campus(@Root() data: AcademicAsignatureCoursePeriodValuation) {
        let id = data.campusId;
        console.log('[FIELD] campus for valuation:', data.id, 'Campus ID:', id);
        
        if (id !== null && id !== undefined) {
            const result = await this.repositoryCampus.findOneBy(id);
            console.log('[FIELD] campus result:', JSON.stringify(result, null, 2));
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => AcademicAsignatureCourse, { nullable: true })
    async academicAsignatureCourse(@Root() data: AcademicAsignatureCoursePeriodValuation) {
        let id = data.academicAsignatureCourseId;
        console.log('[FIELD] academicAsignatureCourse for valuation:', data.id, 'AcademicAsignatureCourse ID:', id);
        
        if (id !== null && id !== undefined) {
            const result = await this.repositoryAcademicAsignatureCourse.findOneBy(id);
            console.log('[FIELD] academicAsignatureCourse result:', JSON.stringify(result, null, 2));
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => AcademicPeriod, { nullable: true })
    async academicPeriod(@Root() data: AcademicAsignatureCoursePeriodValuation) {
        let id = data.academicPeriodId;
        console.log('[FIELD] academicPeriod for valuation:', data.id, 'AcademicPeriod ID:', id);
        
        if (id !== null && id !== undefined) {
            const result = await this.repositoryAcademicPeriod.findOneBy(id);
            console.log('[FIELD] academicPeriod result:', JSON.stringify(result, null, 2));
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => Student, { nullable: true })
    async student(@Root() data: AcademicAsignatureCoursePeriodValuation) {
        let id = data.studentId;
        console.log('[FIELD] student for valuation:', data.id, 'Student ID:', id);
        
        if (id !== null && id !== undefined) {
            const result = await this.repositoryStudent.findOneBy(id);
            console.log('[FIELD] student result:', JSON.stringify(result, null, 2));
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => PerformanceLevel, { nullable: true })
    async performanceLevel(@Root() data: AcademicAsignatureCoursePeriodValuation) {
        let id = data.performanceLevelId;
        console.log('[FIELD] performanceLevel for valuation:', data.id, 'PerformanceLevel ID:', id);
        
        if (id !== null && id !== undefined) {
            const result = await this.repositoryPerformanceLevel.findOneBy(id);
            console.log('[FIELD] performanceLevel result:', JSON.stringify(result, null, 2));
            return result;
        }
        return null;
    }
}