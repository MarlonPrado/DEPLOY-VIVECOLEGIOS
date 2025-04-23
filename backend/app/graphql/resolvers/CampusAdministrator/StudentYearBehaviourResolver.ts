import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { CampusRepository, CourseRepository, PerformanceLevelRepository, SchoolYearRepository, StudentRepository, StudentYearBehaviourRepository, UserRepository } from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewStudentYearBehaviour } from '../../inputs/CampusAdministrator/NewStudentYearBehaviour';
import { IContext } from '../../interfaces/IContext';
import { Course } from '../../models/CampusAdministrator/Course';
import { StudentYearBehaviour, StudentYearBehaviourConnection } from '../../models/CampusAdministrator/StudentYearBehaviour';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { Student } from '../../models/GeneralAdministrator/Student';
import { User } from '../../models/GeneralAdministrator/User';
import { PerformanceLevel } from '../../models/SchoolAdministrator/PerformanceLevel';
import { SchoolYear } from '../../models/SchoolAdministrator/SchoolYear';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(StudentYearBehaviour)
export class StudentYearBehaviourResolver {
  @InjectRepository(StudentYearBehaviour)
  private repository = StudentYearBehaviourRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(Campus)
  private repositoryCampus = CampusRepository;

  @InjectRepository(Course)
  private repositoryCourse = CourseRepository;

  @InjectRepository(SchoolYear)
  private repositorySchoolYear = SchoolYearRepository;

  @InjectRepository(Student)
  private repositoryStudent = StudentRepository;

  @InjectRepository(PerformanceLevel)
  private repositoryPerformanceLevel = PerformanceLevelRepository;

  @Query(() => StudentYearBehaviour, { nullable: true })
  async getStudentYearBehaviour(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => StudentYearBehaviourConnection)
  async getAllStudentYearBehaviour(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('courseId', () => String) courseId: String,
    @Arg('schoolYearId', () => String) schoolYearId: String,
    @Arg('studentId', () => String, { nullable: true }) studentId: String,
  ): Promise<StudentYearBehaviourConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        if (courseId && schoolYearId && studentId) {
          result = await this.repository.findBy({
            where: {
              courseId,
              schoolYearId,
              studentId
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              courseId,
              schoolYearId,
            },
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        if (courseId && schoolYearId && studentId) {
          result = await this.repository.findBy({
            where: {
              courseId,
              schoolYearId,
              studentId
            },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              courseId,
              schoolYearId,
            },
          });
        }
      }
    } else {
      if (orderCreated) {
        if (courseId && schoolYearId && studentId) {
          result = await this.repository.findBy({
            where: {
              courseId,
              schoolYearId,
              studentId,
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              courseId,
              schoolYearId,
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        if (courseId && schoolYearId && studentId) {
          result = await this.repository.findBy({
            where: {
              courseId,
              schoolYearId,
              studentId,
              active: true,
            },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              courseId,
              schoolYearId,
              active: true,
            },
          });
        }
      }
    }
    let resultConn = new StudentYearBehaviourConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => StudentYearBehaviour)
  async createStudentYearBehaviour(@Arg('data') data: NewStudentYearBehaviour, @Ctx() context: IContext): Promise<StudentYearBehaviour> {
    let dataProcess: NewStudentYearBehaviour = removeEmptyStringElements(data);
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

  @Mutation(() => StudentYearBehaviour)
  async updateStudentYearBehaviour(
    @Arg('data') data: NewStudentYearBehaviour,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<StudentYearBehaviour | null> {
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
  async changeActiveStudentYearBehaviour(
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
  async deleteStudentYearBehaviour(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @Mutation(() => Boolean)
  async createPeriodStudentYearBehaviour(
    @Arg('courseId', () => String) courseId: string,
    @Arg('schoolYearId', () => String) schoolYearId: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    let course = await this.repositoryCourse.findOneBy(courseId);
    let schoolYear = await this.repositorySchoolYear.findOneBy(schoolYearId)
    if (course && schoolYear) {
      const students = course.studentsId;
      if (students) {
        for (let student of students) {
          let studentBehaviour =
            await this.repository.findBy({
              where: {
                schoolYearId,
                courseId,
                studentId: student,
              },
            });
          if (studentBehaviour.length == 0) {
            let createdByUserId = context?.user?.authorization?.id;
            const model = await this.repository.create({
              courseId,
              schoolYearId,
              studentId: student,
              active: true,
              version: 0,
              createdByUserId,
            });
            let result = await this.repository.save(
              model
            );
          }
        }
      }

    }
    return true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: StudentYearBehaviour) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: StudentYearBehaviour) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Campus, { nullable: true })
  async campus(@Root() data: StudentYearBehaviour) {
    let id = data.campusId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryCampus.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Course, { nullable: true })
  async course(@Root() data: StudentYearBehaviour) {
    let id = data.courseId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryCourse.findOneBy(id);
      return result;
    }
    return null;
  }

  // @FieldResolver((_type) => AcademicPeriod, { nullable: true })
  // async academicPeriod(@Root() data: StudentYearBehaviour) {
  //   let id = data.schoolYearId;
  //   if (id !== null && id !== undefined) {
  //     const result = await this.repositoryAcademicPeriod.findOneBy(id);
  //     return result;
  //   }
  //   return null;
  // }

  @FieldResolver((_type) => Student, { nullable: true })
  async student(@Root() data: StudentYearBehaviour) {
    let id = data.studentId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryStudent.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => PerformanceLevel, { nullable: true })
  async performanceLevel(@Root() data: StudentYearBehaviour) {
    let id = data.performanceLevelId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryPerformanceLevel.findOneBy(id);
      return result;
    }
    return null;
  }
}
