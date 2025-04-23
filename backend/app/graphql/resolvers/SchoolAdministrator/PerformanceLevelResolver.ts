import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';

import {
  AcademicAsignatureCourseRepository,
  AcademicGradeRepository,
  CampusRepository,
  CourseRepository,
  GeneralPerformanceLevelRepository,
  PerformanceLevelRepository,
  SchoolRepository,
  SchoolYearRepository,
  UserRepository,
} from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { PerformanceLevelCategory } from '../../enums/PerformanceLevelCategory';
import { PerformanceLevelCategoryGrade } from '../../enums/PerformanceLevelCategoryGrade';
import { PerformanceLevelType } from '../../enums/PerformanceLevelType';
import { NewPerformanceLevel } from '../../inputs/SchoolAdministrator/NewPerformanceLevel';
import { IContext } from '../../interfaces/IContext';
import { AcademicAsignatureCourse } from '../../models/CampusAdministrator/AcademicAsignatureCourse';
import { Course } from '../../models/CampusAdministrator/Course';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { GeneralPerformanceLevel } from '../../models/GeneralAdministrator/GeneralPerformanceLevel';
import { School } from '../../models/GeneralAdministrator/School';
import { User } from '../../models/GeneralAdministrator/User';
import {
  PerformanceLevel,
  PerformanceLevelConnection,
} from '../../models/SchoolAdministrator/PerformanceLevel';
import { SchoolYear } from '../../models/SchoolAdministrator/SchoolYear';
import { ConnectionArgs } from '../../pagination/relaySpecs';
import { AcademicGrade } from './../../models/SchoolAdministrator/AcademicGrade';

@Resolver(PerformanceLevel)
export class PerformanceLevelResolver {
  @InjectRepository(PerformanceLevel)
  private repository = PerformanceLevelRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(GeneralPerformanceLevel)
  private repositoryGeneralPerformanceLevel = GeneralPerformanceLevelRepository;

  @InjectRepository(School)
  private repositorySchool = SchoolRepository;

  @InjectRepository(SchoolYear)
  private repositorySchoolYear = SchoolYearRepository;

  @InjectRepository(Campus)
  private repositoryCampus = CampusRepository;

  @InjectRepository(AcademicGrade)
  private repositoryAcademicGrade = AcademicGradeRepository;

  @InjectRepository(AcademicAsignatureCourse)
  private repositoryAcademicAsignatureCourse = AcademicAsignatureCourseRepository;

  @InjectRepository(Course)
  private repositoryCourse = CourseRepository;

  @Query(() => PerformanceLevel, { nullable: true })
  async getPerformanceLevel(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => PerformanceLevelConnection)
  async getAllPerformanceLevel(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('schoolId', () => String) schoolId: String,
    @Arg('schoolYearId', () => String, { nullable: true }) schoolYearId: String,
  ): Promise<PerformanceLevelConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        result = await this.repository.findBy({
          where: { schoolId, schoolYearId },
          order: { createdAt: 'DESC' },
        });
      } else {
        result = await this.repository.findBy({ where: { schoolId, schoolYearId } });
      }
    } else {
      if (orderCreated) {
        result = await this.repository.findBy({
          where: {
            schoolId,
            schoolYearId,
            active: true,
          },
          order: { createdAt: 'DESC' },
        });
      } else {
        result = await this.repository.findBy({
          where: {
            schoolId,
            schoolYearId,
            active: true,
          },
        });
      }
    }
    let resultConn = new PerformanceLevelConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Query(() => PerformanceLevelConnection)
  async getAllPerformanceLevelAcademicAsignatureCourse(
    @Args() args: ConnectionArgs,
    @Arg('academicAsignatureCourseId', () => String) academicAsignatureCourseId: String,
  ): Promise<PerformanceLevelConnection> {
    let result: any[] = [];
    let academicAsignatureCourse = await this.repositoryAcademicAsignatureCourse.findOneBy(
      academicAsignatureCourseId,
    );
    if (academicAsignatureCourse) {
      let course = await this.repositoryCourse.findOneBy(academicAsignatureCourse.courseId);
      if (course) {
        let schoolYear = await this.repositorySchoolYear.findOneBy(course.schoolYearId);
        let campus = await this.repositoryCampus.findOneBy(course.campusId);
        if (campus) {
          result = await this.repository.findBy({
            where: {
              campusId: { $in: [course.campusId] },
              academicGradesId: { $in: [course.academicGradeId] },
              schoolId: campus.schoolId,
              schoolYearId: schoolYear?.id?.toString(),
              active: true,
            },
            order: { order: 1 },
          });
          if (result.length === 0) {
            result = await this.repository.findBy({
              where: {
                campusId: { $in: [course.campusId] },
                schoolId: campus.schoolId,
                schoolYearId: schoolYear?.id?.toString(),
                active: true,
              },
              order: { order: 1 },
            });
            if (result.length === 0) {
              result = await this.repository.findBy({
                where: {
                  academicGradesId: { $in: [course.academicGradeId] },
                  schoolId: campus.schoolId,
                  schoolYearId: schoolYear?.id?.toString(),
                  active: true,
                },
                order: { order: 1 },
              });
              if (result.length === 0) {
                result = await this.repository.findBy({
                  where: {
                    schoolId: campus.schoolId,
                    schoolYearId: schoolYear?.id?.toString(),
                    active: true,
                  },
                  order: { order: 1 },
                });
              }
            }
          }
        }
      }
    }
    let resultConn = new PerformanceLevelConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Query(() => PerformanceLevelConnection)
  async getAllPerformanceLevelAcademicAsignatureCourseFinal(
    @Args() args: ConnectionArgs,
    @Arg('academicAsignatureCourseId', () => String) academicAsignatureCourseId: String,
  ): Promise<PerformanceLevelConnection> {
    let result: any[] = [];
    let academicAsignatureCourse = await this.repositoryAcademicAsignatureCourse.findOneBy(
      academicAsignatureCourseId,
    );
    if (academicAsignatureCourse) {
      let course = await this.repositoryCourse.findOneBy(academicAsignatureCourse.courseId);
      if (course) {
        let schoolYear = await this.repositorySchoolYear.findOneBy(course.schoolYearId);
        let campus = await this.repositoryCampus.findOneBy(course.campusId);
        if (campus) {
          result = await this.repository.findBy({
            where: {
              campusId: { $in: [course.campusId] },
              academicGradesId: { $in: [course.academicGradeId] },
              schoolId: campus.schoolId,
              schoolYearId: schoolYear?.id?.toString(),
              isFinal: true,
              active: true,
            },
            order: { order: 1 },
          });
          if (result.length === 0) {
            result = await this.repository.findBy({
              where: {
                campusId: { $in: [course.campusId] },
                schoolId: campus.schoolId,
                schoolYearId: schoolYear?.id?.toString(),
                isFinal: true,
                active: true,
              },
              order: { order: 1 },
            });
            if (result.length === 0) {
              result = await this.repository.findBy({
                where: {
                  academicGradesId: { $in: [course.academicGradeId] },
                  schoolId: campus.schoolId,
                  schoolYearId: schoolYear?.id?.toString(),
                  isFinal: true,
                  active: true,
                },
                order: { order: 1 },
              });
              if (result.length === 0) {
                result = await this.repository.findBy({
                  where: {
                    schoolId: campus.schoolId,
                    schoolYearId: schoolYear?.id?.toString(),
                    isFinal: true,
                    active: true,
                  },
                  order: { order: 1 },
                });
              }
            }
          }
        }
      }
    }
    let resultConn = new PerformanceLevelConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Query(() => PerformanceLevelConnection)
  async getAllPerformanceLevelAcademicCourse(
    @Args() args: ConnectionArgs,
    @Arg('courseId', () => String) courseId: String,
  ): Promise<PerformanceLevelConnection> {
    let result: any[] = [];
    if (courseId) {
      let course = await this.repositoryCourse.findOneBy(courseId);
      if (course) {
        let schoolYear = await this.repositorySchoolYear.findOneBy(course.schoolYearId);
        let campus = await this.repositoryCampus.findOneBy(course.campusId);
        if (campus) {
          result = await this.repository.findBy({
            where: {
              campusId: { $in: [course.campusId] },
              academicGradesId: { $in: [course.academicGradeId] },
              schoolId: campus.schoolId,
              schoolYearId: schoolYear?.id?.toString(),
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
          if (result.length === 0) {
            result = await this.repository.findBy({
              where: {
                campusId: { $in: [course.campusId] },
                schoolId: campus.schoolId,
                schoolYearId: schoolYear?.id?.toString(),
                active: true,
              },
              order: { createdAt: 'DESC' },
            });
            if (result.length === 0) {
              result = await this.repository.findBy({
                where: {
                  academicGradesId: { $in: [course.academicGradeId] },
                  schoolId: campus.schoolId,
                  schoolYearId: schoolYear?.id?.toString(),
                  active: true,
                },
                order: { createdAt: 'DESC' },
              });
              if (result.length === 0) {
                result = await this.repository.findBy({
                  where: {
                    schoolId: campus.schoolId,
                    schoolYearId: schoolYear?.id?.toString(),
                    active: true,
                  },
                  order: { createdAt: 'DESC' },
                });
              }
            }
          }
        }
      }
    }
    let resultConn = new PerformanceLevelConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Query(() => PerformanceLevelConnection)
  async getAllPerformanceLevelAcademicCourseFinal(
    @Args() args: ConnectionArgs,
    @Arg('courseId', () => String) courseId: String,
  ): Promise<PerformanceLevelConnection> {
    let result: any[] = [];
    if (courseId) {
      let course = await this.repositoryCourse.findOneBy(courseId);
      if (course) {
        let schoolYear = await this.repositorySchoolYear.findOneBy(course.schoolYearId);
        let campus = await this.repositoryCampus.findOneBy(course.campusId);
        if (campus) {
          result = await this.repository.findBy({
            where: {
              campusId: { $in: [course.campusId] },
              academicGradesId: { $in: [course.academicGradeId] },
              schoolId: campus.schoolId,
              schoolYearId: schoolYear?.id?.toString(),
              isFinal: true,
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
          if (result.length === 0) {
            result = await this.repository.findBy({
              where: {
                campusId: { $in: [course.campusId] },
                schoolId: campus.schoolId,
                schoolYearId: schoolYear?.id?.toString(),
                isFinal: true,
                active: true,
              },
              order: { createdAt: 'DESC' },
            });
            if (result.length === 0) {
              result = await this.repository.findBy({
                where: {
                  academicGradesId: { $in: [course.academicGradeId] },
                  schoolId: campus.schoolId,
                  schoolYearId: schoolYear?.id?.toString(),
                  isFinal: true,
                  active: true,
                },
                order: { createdAt: 'DESC' },
              });
              if (result.length === 0) {
                result = await this.repository.findBy({
                  where: {
                    schoolId: campus.schoolId,
                    schoolYearId: schoolYear?.id?.toString(),
                    isFinal: true,
                    active: true,
                  },
                  order: { createdAt: 'DESC' },
                });
              }
            }
          }
        }
      }
    }
    let resultConn = new PerformanceLevelConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => PerformanceLevel)
  async createPerformanceLevel(
    @Arg('data') data: NewPerformanceLevel,
    @Ctx() context: IContext,
  ): Promise<PerformanceLevel> {
    let dataProcess: NewPerformanceLevel = removeEmptyStringElements(data);
    let createdByUserId = context?.user?.authorization?.id;
    if (dataProcess?.type == PerformanceLevelType.QUALITATIVE) {
      dataProcess.minimumScore = undefined;
      dataProcess.topScore = undefined;
    }
    if (dataProcess?.campusId && dataProcess?.campusId?.length > 0) {
      dataProcess.category = PerformanceLevelCategory.CAMPUS;
    } else {
      dataProcess.category = PerformanceLevelCategory.SCHOOL;
    }
    if (dataProcess?.academicGradesId && dataProcess?.academicGradesId?.length > 0) {
      dataProcess.categoryGrade = PerformanceLevelCategoryGrade.SPECIFIC;
    } else {
      dataProcess.categoryGrade = PerformanceLevelCategoryGrade.ALL;
    }
    const model = await this.repository.create({
      ...dataProcess,
      active: true,
      version: 0,
      createdByUserId,
    });
    let result = await this.repository.save(model);
    return result;
  }

  @Mutation(() => PerformanceLevel)
  async updatePerformanceLevel(
    @Arg('data') data: NewPerformanceLevel,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<PerformanceLevel | null> {
    let dataProcess = removeEmptyStringElements(data);
    let updatedByUserId = context?.user?.authorization?.id;
    let result = await this.repository.findOneBy(id);
    if (dataProcess?.type == PerformanceLevelType.QUALITATIVE) {
      dataProcess.minimumScore = undefined;
      dataProcess.topScore = undefined;
    }
    if (dataProcess?.campusId && dataProcess?.campusId?.length > 0) {
      dataProcess.category = PerformanceLevelCategory.CAMPUS;
    } else {
      dataProcess.category = PerformanceLevelCategory.SCHOOL;
    }
    if (dataProcess?.academicGradesId && dataProcess?.academicGradesId?.length > 0) {
      dataProcess.categoryGrade = PerformanceLevelCategoryGrade.SPECIFIC;
    } else {
      dataProcess.categoryGrade = PerformanceLevelCategoryGrade.ALL;
    }
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
  async changeActivePerformanceLevel(
    @Arg('active', () => Boolean) active: boolean,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
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
  async deletePerformanceLevel(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @Mutation(() => Boolean)
  async importPerformanceLevelSchoolYearId(
    @Arg('schoolId', () => String) schoolId: String,
    @Arg('oldSchoolYearId', () => String) oldSchoolYearId: String,
    @Arg('newSchoolYearId', () => String) newSchoolYearId: String,
  ) {
    let results = await this.repository.findBy({
      where: { schoolId, schoolYearId: oldSchoolYearId },
    });
    console.log('IMPORT', results?.length);
    for (let result of results) {
      let academicGradesId = [];
      if (result?.academicGradesId) {
        for (let academicGradeId of result?.academicGradesId) {
          let academicGradeNew: any;
          let academicGradeOld = await this.repositoryAcademicGrade.findOneBy(academicGradeId);
          if (academicGradeOld) {
            academicGradeNew = await this.repositoryAcademicGrade.findBy({
              where: { entityBaseId: academicGradeId, schoolYearId: newSchoolYearId },
            });
            if (academicGradeNew?.length > 0) {
              academicGradesId.push(academicGradeNew[0]?.id?.toString());
            }
          }
        }
      }
      const model = await this.repository.create({
        name: result.name,
        minimumScore: result.minimumScore,
        topScore: result.topScore,
        abbreviation: result.abbreviation,
        colorHex: result.colorHex,
        isFinal: result.isFinal,
        isRecovery: result.isRecovery,
        type: result.type,
        category: result.category,
        categoryGrade: result.categoryGrade,
        generalPerformanceLevelId: result.generalPerformanceLevelId,
        campusId: result.campusId,
        academicGradesId: academicGradesId,
        schoolId: result.schoolId,
        order: result.order,
        createdByUserId: result.createdByUserId,
        updatedByUserId: result.updatedByUserId,
        active: result?.active,
        version: 0,
        schoolYearId: newSchoolYearId.toString(),
        entityBaseId: result?.id?.toString(),
      });
      let resultSave = await this.repository.save(model);
    }
    return true;
  }

  @Mutation(() => Boolean)
  async fixAllPerformanceLevelSchoolAndSchoolYear() {
    let results = await this.repository.findBy({
      where: {
        $or: [
          {
            schoolId: null,
          },
          { schoolYearId: null },
        ],
      },
      order: { createdAt: 'DESC' },
    });
    console.log(results?.length);
    let number = 0;
    for (let result of results) {
      number++;
      if (result?.schoolYearId) {
        console.log('schoolYearId: ', number);
        let schoolYear = await this.repositorySchoolYear.findOneBy(result?.schoolYearId);
        if (schoolYear) {
          result = await this.repository.save({
            _id: new ObjectId(result?.id?.toString()),
            ...result,
            schoolId: schoolYear?.schoolId,
            version: (result?.version as number) + 1,
          });
        }
      } else {
        if (result?.schoolId || result?.campusId) {
          let schoolId;
          if (result?.schoolId) {
            let school = await this.repositorySchool.findOneBy(result?.schoolId);
            if (school) {
              schoolId = school?.id?.toString();
            }
          } else {
            if (result?.campusId) {
              let campus = await this.repositoryCampus.findOneBy(result?.campusId);
              if (campus) {
                schoolId = campus?.schoolId;
              }
            }
          }
          if (schoolId) {
            console.log('schoolYears: ', number);
            let schoolYears = await this.repositorySchoolYear.findBy({
              where: { schoolId: schoolId },
            });
            console.log('schoolYears length: ', schoolYears?.length);
            if (schoolYears && schoolYears?.length === 1) {
              result = await this.repository.save({
                _id: new ObjectId(result?.id?.toString()),
                ...result,
                schoolId: schoolId,
                schoolYearId: schoolYears[0]?.id?.toString(),
                version: (result?.version as number) + 1,
              });
            } else {
              console.log('school -: ', number);
              result = await this.repository.save({
                _id: new ObjectId(result?.id?.toString()),
                ...result,
                active: false,
                version: -1,
              });
            }
          } else {
            console.log('school -: ', number);
            result = await this.repository.save({
              _id: new ObjectId(result?.id?.toString()),
              ...result,
              active: false,
              version: -1,
            });
          }
        } else {
          console.log('school -: ', number);
          result = await this.repository.save({
            _id: new ObjectId(result?.id?.toString()),
            ...result,
            active: false,
            version: -1,
          });
        }
      }
    }
    return true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: PerformanceLevel) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: PerformanceLevel) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => GeneralPerformanceLevel, { nullable: true })
  async generalPerformanceLevel(@Root() data: PerformanceLevel) {
    let id = data.generalPerformanceLevelId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryGeneralPerformanceLevel.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => School, { nullable: true })
  async school(@Root() data: PerformanceLevel) {
    let id = data.schoolId;
    if (id !== null && id !== undefined) {
      const result = await this.repositorySchool.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => SchoolYear, { nullable: true })
  async schoolYear(@Root() data: PerformanceLevel) {
    let id = data.schoolYearId;
    if (id !== null && id !== undefined) {
      const result = await this.repositorySchoolYear.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => [Campus], { nullable: true })
  async campus(@Root() data: PerformanceLevel) {
    let ids = data.campusId;
    if (ids !== null && ids !== undefined) {
      let dataIds: any[] = [];
      ids.forEach(async (id: any) => {
        dataIds.push(new ObjectId(id));
      });
      const result = await this.repositoryCampus.findBy({ where: { _id: { $in: dataIds } } });
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => [AcademicGrade], { nullable: true })
  async academicGrades(@Root() data: PerformanceLevel) {
    let ids = data.academicGradesId;
    if (ids !== null && ids !== undefined) {
      let dataIds: any[] = [];
      ids.forEach(async (id: any) => {
        dataIds.push(new ObjectId(id));
      });
      const result = await this.repositoryAcademicGrade.findBy({
        where: { _id: { $in: dataIds } },
      });
      return result;
    }
    return null;
  }
}
