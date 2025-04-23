import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { AcademicAsignatureCourseRepository, AcademicPeriodRepository, CampusRepository, PerformanceLevelRepository, StudentAttendanceRepository, StudentRepository, UserRepository } from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewStudentAttendance } from '../../inputs/CampusAdministrator/NewStudentAttendance';
import { IContext } from '../../interfaces/IContext';
import { AcademicAsignatureCourse } from '../../models/CampusAdministrator/AcademicAsignatureCourse';
import { StudentAttendance, StudentAttendanceConnection } from '../../models/CampusAdministrator/StudentAttendance';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { Student } from '../../models/GeneralAdministrator/Student';
import { User } from '../../models/GeneralAdministrator/User';
import { AcademicPeriod } from '../../models/SchoolAdministrator/AcademicPeriod';
import { PerformanceLevel } from '../../models/SchoolAdministrator/PerformanceLevel';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(StudentAttendance)
export class StudentAttendanceResolver {
  @InjectRepository(StudentAttendance)
  private repository = StudentAttendanceRepository;

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

  @Query(() => StudentAttendance, { nullable: true })
  async getStudentAttendance(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => StudentAttendanceConnection)
  async getAllStudentAttendance(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('academicAsignatureCourseId', () => String) academicAsignatureCourseId: String,
    @Arg('academicPeriodId', () => String) academicPeriodId: String,
    @Arg('studentId', () => String, { nullable: true }) studentId: String,
  ): Promise<StudentAttendanceConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        if (academicAsignatureCourseId && academicPeriodId && studentId) {
          result = await this.repository.findBy({
            where: {
              academicAsignatureCourseId,
              academicPeriodId,
              studentId
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              academicAsignatureCourseId,
              academicPeriodId,
            },
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        if (academicAsignatureCourseId && academicPeriodId && studentId) {
          result = await this.repository.findBy({
            where: {
              academicAsignatureCourseId,
              academicPeriodId,
              studentId
            },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              academicAsignatureCourseId,
              academicPeriodId,
            },
          });
        }
      }
    } else {
      if (orderCreated) {
        if (academicAsignatureCourseId && academicPeriodId && studentId) {
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
        if (academicAsignatureCourseId && academicPeriodId && studentId) {
          result = await this.repository.findBy({
            where: {
              academicAsignatureCourseId,
              academicPeriodId,
              studentId,
              active: true,
            },
          });
        } else {
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
    let resultConn = new StudentAttendanceConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => StudentAttendance)
  async createStudentAttendance(@Arg('data') data: NewStudentAttendance, @Ctx() context: IContext): Promise<StudentAttendance> {
    let dataProcess: NewStudentAttendance = removeEmptyStringElements(data);
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

  @Mutation(() => StudentAttendance)
  async updateStudentAttendance(
    @Arg('data') data: NewStudentAttendance,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<StudentAttendance | null> {
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
  async changeActiveStudentAttendance(
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
  async deleteStudentAttendance(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: StudentAttendance) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: StudentAttendance) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Campus, { nullable: true })
  async campus(@Root() data: StudentAttendance) {
    let id = data.campusId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryCampus.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => AcademicAsignatureCourse, { nullable: true })
  async academicAsignatureCourse(@Root() data: StudentAttendance) {
    let id = data.academicAsignatureCourseId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryAcademicAsignatureCourse.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => AcademicPeriod, { nullable: true })
  async academicPeriod(@Root() data: StudentAttendance) {
    let id = data.academicPeriodId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryAcademicPeriod.findOneBy(id);
      return result;
    }
    return null;
  }
  @FieldResolver((_type) => Student, { nullable: true })
  async student(@Root() data: StudentAttendance) {
    let id = data.studentId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryStudent.findOneBy(id);
      return result;
    }
    return null;
  }

}
