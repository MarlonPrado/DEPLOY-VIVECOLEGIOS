import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { AcademicAsignatureCourseRepository, AcademicAsignatureRepository, AcademicGradeRepository, AcademicPeriodRepository, AcademicStandardRepository, CampusRepository, ClassroomPlanRepository, GeneralBasicLearningRightRepository, LearningRepository, UserRepository } from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewClassroomPlan } from '../../inputs/CampusAdministrator/NewClassroomPlan';
import { IContext } from '../../interfaces/IContext';
import { AcademicAsignatureCourse } from '../../models/CampusAdministrator/AcademicAsignatureCourse';
import { ClassroomPlan, ClassroomPlanConnection } from '../../models/CampusAdministrator/ClassroomPlan';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { GeneralBasicLearningRight } from '../../models/GeneralAdministrator/GeneralBasicLearningRight';
import { User } from '../../models/GeneralAdministrator/User';
import { AcademicAsignature } from '../../models/SchoolAdministrator/AcademicAsignature';
import { AcademicGrade } from '../../models/SchoolAdministrator/AcademicGrade';
import { AcademicPeriod } from '../../models/SchoolAdministrator/AcademicPeriod';
import { AcademicStandard } from '../../models/SchoolAdministrator/AcademicStandard';
import { Learning } from '../../models/SchoolAdministrator/Learning';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(ClassroomPlan)
export class ClassroomPlanResolver {
    @InjectRepository(ClassroomPlan)
    private repository = ClassroomPlanRepository;

    @InjectRepository(User)
    private repositoryUser = UserRepository;

    @InjectRepository(Campus)
    private repositoryCampus = CampusRepository;

    @InjectRepository(AcademicAsignature)
    private repositoryAcademicAsignature = AcademicAsignatureRepository;

    @InjectRepository(AcademicGrade)
    private repositoryAcademicGrade = AcademicGradeRepository;

    @InjectRepository(AcademicAsignatureCourse)
    private repositoryAcademicAsignatureCourse = AcademicAsignatureCourseRepository;

    @InjectRepository(AcademicPeriod)
    private repositoryAcademicPeriod = AcademicPeriodRepository;

    @InjectRepository(Learning)
    private repositoryLearning = LearningRepository;

    @InjectRepository(AcademicStandard)
    private repositoryAcademicStandard = AcademicStandardRepository;

    @InjectRepository(GeneralBasicLearningRight)
    private repositoryGeneralBasicLearningRight = GeneralBasicLearningRightRepository;

    @Query(() => ClassroomPlan, { nullable: true })
    async getClassroomPlan(@Arg('id', () => String) id: string) {
        const result = await this.repository.findOneBy(id);
        return result;
    }

    //Filtrar por area y grado 
    @Query(() => ClassroomPlanConnection)
    async getAllClassroomPlan(
        @Args() args: ConnectionArgs,
        @Arg('allData', () => Boolean) allData: Boolean,
        @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
        @Arg('academicAsignatureCourseId', () => String) academicAsignatureCourseId: String,
    ): Promise<ClassroomPlanConnection> {
        let result;
        if (allData) {
            if (orderCreated) {
                result = await this.repository.findBy({
                    where: {
                        academicAsignatureCourseId
                    },
                    order: { createdAt: 'DESC' },
                });
            } else {
                result = await this.repository.findBy({
                    where: {
                        academicAsignatureCourseId
                    },
                });
            }
        } else {
            if (orderCreated) {
                result = await this.repository.findBy({
                    where: {
                        academicAsignatureCourseId,
                        active: true,
                    },
                    order: { createdAt: 'DESC' },
                });
            } else {
                result = await this.repository.findBy({
                    where: {
                        academicAsignatureCourseId,
                        active: true,
                    },
                });
            }
        }
        let resultConn = new ClassroomPlanConnection();
        let resultConnection = connectionFromArraySlice(result, args, {
            sliceStart: 0,
            arrayLength: result.length,
        });
        resultConn = { ...resultConnection, totalCount: result.length };
        return resultConn;
    }

    @Mutation(() => ClassroomPlan)
    async createClassroomPlan(
        @Arg('data') data: NewClassroomPlan,
        @Ctx() context: IContext
    ): Promise<ClassroomPlan> {
        let dataProcess: NewClassroomPlan = removeEmptyStringElements(data);
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

    @Mutation(() => ClassroomPlan)
    async updateClassroomPlan(
        @Arg('data') data: NewClassroomPlan,
        @Arg('id', () => String) id: string,
        @Ctx() context: IContext
    ): Promise<ClassroomPlan | null> {
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
    async changeActiveClassroomPlan(
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
    async deleteClassroomPlan(
        @Arg('id', () => String) id: string,
        @Ctx() context: IContext
    ): Promise<Boolean | null> {
        let data = await this.repository.findOneBy(id);
        let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
        return result?.result?.ok === 1 ?? true;
    }

    @FieldResolver((_type) => User, { nullable: true })
    async createdByUser(@Root() data: ClassroomPlan) {
        let id = data.createdByUserId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryUser.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => User, { nullable: true })
    async updatedByUser(@Root() data: ClassroomPlan) {
        let id = data.updatedByUserId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryUser.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => Campus, { nullable: true })
    async campus(@Root() data: ClassroomPlan) {
        let id = data.campusId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryCampus.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => AcademicPeriod, { nullable: true })
    async academicPeriod(@Root() data: ClassroomPlan) {
        let id = data.academicPeriodId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryAcademicPeriod.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => AcademicAsignature, { nullable: true })
    async academicAsignature(@Root() data: ClassroomPlan) {
        let id = data.academicAsignatureId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryAcademicAsignature.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => AcademicGrade, { nullable: true })
    async academicGrade(@Root() data: ClassroomPlan) {
        let id = data.academicGradeId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryAcademicGrade.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => AcademicAsignatureCourse, { nullable: true })
    async academicAsignatureCourse(@Root() data: ClassroomPlan) {
        let id = data.academicAsignatureCourseId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryAcademicAsignatureCourse.findOneBy(id);
            return result;
        }
        return null;
    }


    @FieldResolver((_type) => [Learning], { nullable: true })
    async learnigs(@Root() data: ClassroomPlan) {
        let ids = data.learningsId;
        if (ids !== null && ids !== undefined) {
            let dataIds: any[] = [];
            ids.forEach(async (id: any) => {
                dataIds.push(new ObjectId(id));
            });
            const result = await this.repositoryLearning.findBy({ where: { _id: { $in: dataIds } } });
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => [AcademicStandard], { nullable: true })
    async academicStandards(@Root() data: ClassroomPlan) {
        let ids = data.academicStandardsId;
        if (ids !== null && ids !== undefined) {
            let dataIds: any[] = [];
            ids.forEach(async (id: any) => {
                dataIds.push(new ObjectId(id));
            });
            const result = await this.repositoryAcademicStandard.findBy({ where: { _id: { $in: dataIds } } });
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => [GeneralBasicLearningRight], { nullable: true })
    async generalBasicLearningRights(@Root() data: ClassroomPlan) {
        let ids = data.generalBasicLearningRightsId;
        if (ids !== null && ids !== undefined) {
            let dataIds: any[] = [];
            ids.forEach(async (id: any) => {
                dataIds.push(new ObjectId(id));
            });
            const result = await this.repositoryGeneralBasicLearningRight.findBy({ where: { _id: { $in: dataIds } } });
            return result;
        }
        return null;
    }

}
