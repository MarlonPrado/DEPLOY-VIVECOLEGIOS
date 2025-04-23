import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { AcademicAsignatureCourseRepository, AcademicAsignatureCourseYearValuationRepository, CampusRepository, PerformanceLevelRepository, SchoolYearRepository, StudentRepository, UserRepository } from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewAcademicAsignatureCourseYearValuation } from '../../inputs/CampusAdministrator/NewAcademicAsignatureCourseYearValuation';
import { IContext } from '../../interfaces/IContext';
import { AcademicAsignatureCourse } from '../../models/CampusAdministrator/AcademicAsignatureCourse';
import { AcademicAsignatureCourseYearValuation, AcademicAsignatureCourseYearValuationConnection } from '../../models/CampusAdministrator/AcademicAsignatureCourseYearValuation';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { Student } from '../../models/GeneralAdministrator/Student';
import { User } from '../../models/GeneralAdministrator/User';
import { PerformanceLevel } from '../../models/SchoolAdministrator/PerformanceLevel';
import { SchoolYear } from '../../models/SchoolAdministrator/SchoolYear';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(AcademicAsignatureCourseYearValuation)
export class AcademicAsignatureCourseYearValuationResolver {
  @InjectRepository(AcademicAsignatureCourseYearValuation)
  private repository = AcademicAsignatureCourseYearValuationRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(Campus)
  private repositoryCampus = CampusRepository;

  @InjectRepository(AcademicAsignatureCourse)
  private repositoryAcademicAsignatureCourse = AcademicAsignatureCourseRepository;

  @InjectRepository(SchoolYear)
  private repositorySchoolYear = SchoolYearRepository;

  @InjectRepository(Student)
  private repositoryStudent = StudentRepository;

  @InjectRepository(PerformanceLevel)
  private repositoryPerformanceLevel = PerformanceLevelRepository;

  @Query(() => AcademicAsignatureCourseYearValuation, { nullable: true })
  async getAcademicAsignatureCourseYearValuation(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => AcademicAsignatureCourseYearValuationConnection)
  async getAllAcademicAsignatureCourseYearValuation(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('academicAsignatureCourseId', () => String) academicAsignatureCourseId: String,
    @Arg('schoolYearId', () => String) schoolYearId: String,
    @Arg('studentId', () => String, { nullable: true }) studentId: String,
  ): Promise<AcademicAsignatureCourseYearValuationConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        if (academicAsignatureCourseId && schoolYearId && studentId) {
          result = await this.repository.findBy({
            where: {
              academicAsignatureCourseId,
              schoolYearId,
              studentId
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              academicAsignatureCourseId,
              schoolYearId,
            },
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        if (academicAsignatureCourseId && schoolYearId && studentId) {
          result = await this.repository.findBy({
            where: {
              academicAsignatureCourseId,
              schoolYearId,
              studentId
            },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              academicAsignatureCourseId,
              schoolYearId,
            },
          });
        }
      }
    } else {
      if (orderCreated) {
        if (academicAsignatureCourseId && schoolYearId && studentId) {
          result = await this.repository.findBy({
            where: {
              academicAsignatureCourseId,
              schoolYearId,
              studentId,
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              academicAsignatureCourseId,
              schoolYearId,
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        if (academicAsignatureCourseId && schoolYearId && studentId) {
          result = await this.repository.findBy({
            where: {
              academicAsignatureCourseId,
              schoolYearId,
              studentId,
              active: true,
            },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              academicAsignatureCourseId,
              schoolYearId,
              active: true,
            },
          });
        }
      }
    }
    let resultConn = new AcademicAsignatureCourseYearValuationConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => AcademicAsignatureCourseYearValuation)
  async createAcademicAsignatureCourseYearValuation(@Arg('data') data: NewAcademicAsignatureCourseYearValuation, @Ctx() context: IContext): Promise<AcademicAsignatureCourseYearValuation> {
    let dataProcess: NewAcademicAsignatureCourseYearValuation = removeEmptyStringElements(data);
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

  @Mutation(() => AcademicAsignatureCourseYearValuation)
  async updateAcademicAsignatureCourseYearValuation(
    @Arg('data') data: NewAcademicAsignatureCourseYearValuation,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<AcademicAsignatureCourseYearValuation | null> {
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
  async changeActiveAcademicAsignatureCourseYearValuation(
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
  async deleteAcademicAsignatureCourseYearValuation(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: AcademicAsignatureCourseYearValuation) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: AcademicAsignatureCourseYearValuation) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Campus, { nullable: true })
  async campus(@Root() data: AcademicAsignatureCourseYearValuation) {
    let id = data.campusId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryCampus.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => AcademicAsignatureCourse, { nullable: true })
  async academicAsignatureCourse(@Root() data: AcademicAsignatureCourseYearValuation) {
    let id = data.academicAsignatureCourseId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryAcademicAsignatureCourse.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => SchoolYear, { nullable: true })
  async academicPeriod(@Root() data: AcademicAsignatureCourseYearValuation) {
    let id = data.schoolYearId;
    if (id !== null && id !== undefined) {
      const result = await this.repositorySchoolYear.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Student, { nullable: true })
  async student(@Root() data: AcademicAsignatureCourseYearValuation) {
    let id = data.studentId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryStudent.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => PerformanceLevel, { nullable: true })
  async performanceLevel(@Root() data: AcademicAsignatureCourseYearValuation) {
    let id = data.performanceLevelId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryPerformanceLevel.findOneBy(id);
      return result;
    }
    return null;
  }

}
