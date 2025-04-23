import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { AcademicAsignatureRepository, AcademicGradeRepository, CampusRepository, QuestionBankTestOnlineRepository, TeacherRepository, UserRepository } from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewQuestionBankTestOnline } from '../../inputs/CampusAdministrator/NewQuestionBankTestOnline';
import { IContext } from '../../interfaces/IContext';
import { QuestionBankTestOnline, QuestionBankTestOnlineConnection } from '../../models/CampusAdministrator/QuestionBankTestOnline';
import { Teacher } from '../../models/CampusAdministrator/Teacher';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { User } from '../../models/GeneralAdministrator/User';
import { AcademicAsignature } from '../../models/SchoolAdministrator/AcademicAsignature';
import { AcademicGrade } from '../../models/SchoolAdministrator/AcademicGrade';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(QuestionBankTestOnline)
export class QuestionBankTestOnlineResolver {
    @InjectRepository(QuestionBankTestOnline)
    private repository = QuestionBankTestOnlineRepository;

    @InjectRepository(User)
    private repositoryUser = UserRepository;

    @InjectRepository(Campus)
    private repositoryCampus = CampusRepository;

    @InjectRepository(AcademicAsignature)
    private repositoryAcademicAsignature = AcademicAsignatureRepository;

    @InjectRepository(AcademicGrade)
    private repositoryAcademicGrade = AcademicGradeRepository;

    @InjectRepository(Teacher)
    private repositoryTeacher = TeacherRepository;

    @Query(() => QuestionBankTestOnline, { nullable: true })
    async getQuestionBankTestOnline(@Arg('id', () => String) id: string) {
        const result = await this.repository.findOneBy(id);
        return result;
    }

    @Query(() => QuestionBankTestOnlineConnection)
    async getAllQuestionBankTestOnline(
        @Args() args: ConnectionArgs,
        @Arg('allData', () => Boolean) allData: Boolean,
        @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
        @Arg('campusId', () => String) campusId: String,
    ): Promise<QuestionBankTestOnlineConnection> {
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
        let resultConn = new QuestionBankTestOnlineConnection();
        let resultConnection = connectionFromArraySlice(result, args, {
            sliceStart: 0,
            arrayLength: result.length,
        });
        resultConn = { ...resultConnection, totalCount: result.length };
        return resultConn;
    }

    @Mutation(() => QuestionBankTestOnline)
    async createQuestionBankTestOnline(
        @Arg('data') data: NewQuestionBankTestOnline,
        @Ctx() context: IContext
    ): Promise<QuestionBankTestOnline> {
        let dataProcess: NewQuestionBankTestOnline = removeEmptyStringElements(data);
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

    @Mutation(() => QuestionBankTestOnline)
    async updateQuestionBankTestOnline(
        @Arg('data') data: NewQuestionBankTestOnline,
        @Arg('id', () => String) id: string,
        @Ctx() context: IContext
    ): Promise<QuestionBankTestOnline | null> {
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
    async changeActiveQuestionBankTestOnline(
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
    async deleteQuestionBankTestOnline(
        @Arg('id', () => String) id: string,
        @Ctx() context: IContext
    ): Promise<Boolean | null> {
        let data = await this.repository.findOneBy(id);
        let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
        return result?.result?.ok === 1 ?? true;
    }

    @FieldResolver((_type) => User, { nullable: true })
    async createdByUser(@Root() data: QuestionBankTestOnline) {
        let id = data.createdByUserId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryUser.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => User, { nullable: true })
    async updatedByUser(@Root() data: QuestionBankTestOnline) {
        let id = data.updatedByUserId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryUser.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => Campus, { nullable: true })
    async campus(@Root() data: QuestionBankTestOnline) {
        let id = data.campusId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryCampus.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => AcademicAsignature, { nullable: true })
    async academicAsignature(@Root() data: QuestionBankTestOnline) {
        let id = data.academicAsignatureId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryAcademicAsignature.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => AcademicGrade, { nullable: true })
    async academicGrade(@Root() data: QuestionBankTestOnline) {
        let id = data.academicAsignatureId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryAcademicGrade.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => Teacher, { nullable: true })
    async teacher(@Root() data: QuestionBankTestOnline) {
        let id = data.teacherId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryTeacher.findOneBy(id);
            return result;
        }
        return null;
    }
}
