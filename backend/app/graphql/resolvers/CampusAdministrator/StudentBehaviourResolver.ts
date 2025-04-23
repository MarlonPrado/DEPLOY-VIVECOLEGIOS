import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { AcademicPeriodRepository, CampusRepository, CourseRepository, PerformanceLevelRepository, StudentBehaviourRepository, StudentRepository, UserRepository } from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewStudentBehaviour } from '../../inputs/CampusAdministrator/NewStudentBehaviour';
import { IContext } from '../../interfaces/IContext';
import { Course } from '../../models/CampusAdministrator/Course';
import { StudentBehaviour, StudentBehaviourConnection } from '../../models/CampusAdministrator/StudentBehaviour';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { Student } from '../../models/GeneralAdministrator/Student';
import { User } from '../../models/GeneralAdministrator/User';
import { AcademicPeriod } from '../../models/SchoolAdministrator/AcademicPeriod';
import { PerformanceLevel } from '../../models/SchoolAdministrator/PerformanceLevel';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(StudentBehaviour)
export class StudentBehaviourResolver {
  @InjectRepository(StudentBehaviour)
  private repository = StudentBehaviourRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(Campus)
  private repositoryCampus = CampusRepository;

  @InjectRepository(Course)
  private repositoryCourse = CourseRepository;

  @InjectRepository(AcademicPeriod)
  private repositoryAcademicPeriod = AcademicPeriodRepository;

  @InjectRepository(Student)
  private repositoryStudent = StudentRepository;

  @InjectRepository(PerformanceLevel)
  private repositoryPerformanceLevel = PerformanceLevelRepository;

  @Query(() => StudentBehaviour, { nullable: true })
  async getStudentBehaviour(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => StudentBehaviourConnection)
  async getAllStudentBehaviour(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('courseId', () => String) courseId: String,
    @Arg('academicPeriodId', () => String) academicPeriodId: String,
    @Arg('studentId', () => String, { nullable: true }) studentId: String,
  ): Promise<StudentBehaviourConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        if (courseId && academicPeriodId && studentId) {
          result = await this.repository.findBy({
            where: {
              courseId,
              academicPeriodId,
              studentId
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              courseId,
              academicPeriodId,
            },
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        if (courseId && academicPeriodId && studentId) {
          result = await this.repository.findBy({
            where: {
              courseId,
              academicPeriodId,
              studentId
            },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              courseId,
              academicPeriodId,
            },
          });
        }
      }
    } else {
      if (orderCreated) {
        if (courseId && academicPeriodId && studentId) {
          result = await this.repository.findBy({
            where: {
              courseId,
              academicPeriodId,
              studentId,
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              courseId,
              academicPeriodId,
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        if (courseId && academicPeriodId && studentId) {
          result = await this.repository.findBy({
            where: {
              courseId,
              academicPeriodId,
              studentId,
              active: true,
            },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              courseId,
              academicPeriodId,
              active: true,
            },
          });
        }
      }
    }
    let resultConn = new StudentBehaviourConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => StudentBehaviour)
  async createStudentBehaviour(@Arg('data') data: NewStudentBehaviour, @Ctx() context: IContext): Promise<StudentBehaviour> {
    let dataProcess: NewStudentBehaviour = removeEmptyStringElements(data);
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

  @Mutation(() => StudentBehaviour)
  async updateStudentBehaviour(
    @Arg('data') data: NewStudentBehaviour,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<StudentBehaviour | null> {
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
  async changeActiveStudentBehaviour(
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
  async deleteStudentBehaviour(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @Mutation(() => Boolean)
  async createPeriodStudentBehaviour(
    @Arg('courseId', () => String) courseId: string,
    @Arg('academicPeriodId', () => String) academicPeriodId: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    let course = await this.repositoryCourse.findOneBy(courseId);
    let academicPeriod = await this.repositoryAcademicPeriod.findOneBy(academicPeriodId)
    if (course && academicPeriod) {
      const students = course.studentsId;
      if (students) {
        for (let student of students) {
          let studentBehaviour =
            await this.repository.findBy({
              where: {
                academicPeriodId,
                courseId,
                studentId: student,
              },
            });
          if (studentBehaviour.length == 0) {
            let createdByUserId = context?.user?.authorization?.id;
            const model = await this.repository.create({
              courseId,
              academicPeriodId,
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
  async createdByUser(@Root() data: StudentBehaviour) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: StudentBehaviour) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Campus, { nullable: true })
  async campus(@Root() data: StudentBehaviour) {
    let id = data.campusId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryCampus.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Course, { nullable: true })
  async course(@Root() data: StudentBehaviour) {
    let id = data.courseId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryCourse.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => AcademicPeriod, { nullable: true })
  async academicPeriod(@Root() data: StudentBehaviour) {
    let id = data.academicPeriodId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryAcademicPeriod.findOneBy(id);
      return result;
    }
    return null;
  }
  @FieldResolver((_type) => Student, { nullable: true })
  async student(@Root() data: StudentBehaviour) {
    let id = data.studentId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryStudent.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => PerformanceLevel, { nullable: true })
  async performanceLevel(@Root() data: StudentBehaviour) {
    let id = data.performanceLevelId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryPerformanceLevel.findOneBy(id);
      return result;
    }
    return null;
  }
}
