import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { AcademicPeriodRepository, CampusRepository, CourseRepository, ObserverAnnotationTypeRepository, StudentObserverAnnotationRepository, StudentRepository, UserRepository } from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewStudentObserverAnnotation } from '../../inputs/CampusAdministrator/NewStudentObserverAnnotation';
import { IContext } from '../../interfaces/IContext';
import { Course } from '../../models/CampusAdministrator/Course';
import { StudentObserverAnnotation, StudentObserverAnnotationConnection } from '../../models/CampusAdministrator/StudentObserverAnnotation';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { Student } from '../../models/GeneralAdministrator/Student';
import { User } from '../../models/GeneralAdministrator/User';
import { AcademicPeriod } from '../../models/SchoolAdministrator/AcademicPeriod';
import { ObserverAnnotationType } from '../../models/SchoolAdministrator/ObserverAnnotationType';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(StudentObserverAnnotation)
export class StudentObserverAnnotationResolver {
  @InjectRepository(StudentObserverAnnotation)
  private repository = StudentObserverAnnotationRepository;

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

  @InjectRepository(ObserverAnnotationType)
  private repositoryObserverAnnotationType = ObserverAnnotationTypeRepository;

  @Query(() => StudentObserverAnnotation, { nullable: true })
  async getStudentObserverAnnotation(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => StudentObserverAnnotationConnection)
  async getAllStudentObserverAnnotation(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('studentId', () => String) studentId: String,
    @Arg('courseId', () => String, { nullable: true }) courseId: String,
  ): Promise<StudentObserverAnnotationConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        if (courseId) {
          result = await this.repository.findBy({
            where: {
              courseId,
              studentId
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              studentId
            },
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        if (courseId) {
          result = await this.repository.findBy({
            where: {
              courseId,
              studentId
            },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              studentId
            },
          });
        }
      }
    } else {
      if (orderCreated) {
        if (courseId) {
          result = await this.repository.findBy({
            where: {
              courseId,
              studentId,
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              studentId,
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        if (courseId) {
          result = await this.repository.findBy({
            where: {
              courseId,
              studentId,
              active: true,
            },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              studentId,
              active: true,
            },
          });
        }
      }
    }
    let resultConn = new StudentObserverAnnotationConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => StudentObserverAnnotation)
  async createStudentObserverAnnotation(@Arg('data') data: NewStudentObserverAnnotation, @Ctx() context: IContext): Promise<StudentObserverAnnotation> {
    let dataProcess: NewStudentObserverAnnotation = removeEmptyStringElements(data);
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

  @Mutation(() => StudentObserverAnnotation)
  async updateStudentObserverAnnotation(
    @Arg('data') data: NewStudentObserverAnnotation,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<StudentObserverAnnotation | null> {
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
  async changeActiveStudentObserverAnnotation(
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
  async deleteStudentObserverAnnotation(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @Mutation(() => Boolean)
  async createPeriodStudentObserverAnnotation(
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
          let StudentObserverAnnotation =
            await this.repository.findBy({
              where: {
                academicPeriodId,
                courseId,
                studentId: student,
              },
            });
          if (StudentObserverAnnotation.length == 0) {
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
  async createdByUser(@Root() data: StudentObserverAnnotation) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: StudentObserverAnnotation) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Campus, { nullable: true })
  async campus(@Root() data: StudentObserverAnnotation) {
    let id = data.campusId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryCampus.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Course, { nullable: true })
  async course(@Root() data: StudentObserverAnnotation) {
    let id = data.courseId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryCourse.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => AcademicPeriod, { nullable: true })
  async academicPeriod(@Root() data: StudentObserverAnnotation) {
    let id = data.academicPeriodId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryAcademicPeriod.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Student, { nullable: true })
  async student(@Root() data: StudentObserverAnnotation) {
    let id = data.studentId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryStudent.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => ObserverAnnotationType, { nullable: true })
  async observerAnnotationType(@Root() data: StudentObserverAnnotation) {
    let id = data.observerAnnotationTypeId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryObserverAnnotationType.findOneBy(id);
      return result;
    }
    return null;
  }

}
