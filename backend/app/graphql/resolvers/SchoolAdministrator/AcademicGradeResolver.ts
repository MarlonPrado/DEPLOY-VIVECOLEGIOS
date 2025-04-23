import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';

import {
  AcademicGradeRepository,
  EducationLevelRepository,
  GeneralAcademicCycleRepository,
  GeneralAcademicGradeRepository,
  SchoolRepository,
  SchoolYearRepository,
  SpecialtyRepository,
  StudentRepository,
  UserRepository,
} from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewAcademicGrade } from '../../inputs/SchoolAdministrator/NewAcademicGrade';
import { IContext } from '../../interfaces/IContext';
import { GeneralAcademicCycle } from '../../models/GeneralAdministrator/GeneralAcademicCycle';
import { GeneralAcademicGrade } from '../../models/GeneralAdministrator/GeneralAcademicGrade';
import { School } from '../../models/GeneralAdministrator/School';
import { Student } from '../../models/GeneralAdministrator/Student';
import { User } from '../../models/GeneralAdministrator/User';
import {
  AcademicGrade,
  AcademicGradeConnection,
} from '../../models/SchoolAdministrator/AcademicGrade';
import { EducationLevel } from '../../models/SchoolAdministrator/EducationLevel';
import { SchoolYear } from '../../models/SchoolAdministrator/SchoolYear';
import { Specialty } from '../../models/SchoolAdministrator/Specialty';
import { ConnectionArgs } from '../../pagination/relaySpecs';
import { CourseResolver } from '../CampusAdministrator/CourseResolver';

@Resolver(AcademicGrade)
export class AcademicGradeResolver {
  @InjectRepository(AcademicGrade)
  private repository = AcademicGradeRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(EducationLevel)
  private repositoryEducationLevel = EducationLevelRepository;

  @InjectRepository(Specialty)
  private repositorySpecialty = SpecialtyRepository;

  @InjectRepository(GeneralAcademicCycle)
  private repositoryGeneralAcademicCycle = GeneralAcademicCycleRepository;

  @InjectRepository(GeneralAcademicGrade)
  private repositoryGeneralAcademicGrade = GeneralAcademicGradeRepository;

  @InjectRepository(School)
  private repositorySchool = SchoolRepository;

  @InjectRepository(SchoolYear)
  private repositorySchoolYear = SchoolYearRepository;

  @InjectRepository(Student)
  private repositoryStudent = StudentRepository;

  private courseResolver = new CourseResolver();

  @Query(() => AcademicGrade, { nullable: true })
  async getAcademicGrade(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => AcademicGradeConnection)
  async getAllAcademicGrade(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('schoolId', () => String) schoolId: String,
    @Arg('schoolYearId', () => String, { nullable: true }) schoolYearId: String,
  ): Promise<AcademicGradeConnection> {
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
    let resultConn = new AcademicGradeConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => AcademicGrade)
  async createAcademicGrade(
    @Arg('data') data: NewAcademicGrade,
    @Ctx() context: IContext,
  ): Promise<AcademicGrade> {
    let dataProcess: NewAcademicGrade = removeEmptyStringElements(data);
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

  @Mutation(() => AcademicGrade)
  async updateAcademicGrade(
    @Arg('data') data: NewAcademicGrade,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<AcademicGrade | null> {
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
  async changeActiveAcademicGrade(
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
  async importAcademicGradeSchoolYearId(
    @Arg('schoolId', () => String) schoolId: String,
    @Arg('oldSchoolYearId', () => String) oldSchoolYearId: String,
    @Arg('newSchoolYearId', () => String) newSchoolYearId: String,
    @Arg('course', () => Boolean) course: boolean,
  ) {
    let results = await this.repository.findBy({
      where: { schoolId, schoolYearId: oldSchoolYearId },
    });
    console.log('IMPORT', results?.length);
    for (let result of results) {
      let educationLevelNew: any;
      let educationLevelOld = await this.repositoryEducationLevel.findOneBy(
        result?.educationLevelId,
      );
      if (educationLevelOld) {
        educationLevelNew = await this.repositoryEducationLevel.findBy({
          where: { entityBaseId: result?.educationLevelId, schoolYearId: newSchoolYearId },
        });
      }
      // let specialityNew: any;
      // let specialityOld = await this.repositorySpecialty.findOneBy(result?.specialtyId);
      // if (specialityOld) {
      //   specialityNew = await this.repositorySpecialty.findBy({ where: { name: specialityOld?.name, schoolYearId: newSchoolYearId } });
      // }
      const model = await this.repository.create({
        name: result.name,
        educationLevelId:
          educationLevelNew?.length > 0 ? educationLevelNew[0]?.id?.toString() : null,
        specialtyId: result.specialtyId,
        generalAcademicCycleId: result.generalAcademicCycleId,
        generalAcademicGradeId: result.generalAcademicGradeId,
        schoolId: result.schoolId,
        createdByUserId: result.createdByUserId,
        updatedByUserId: result.updatedByUserId,
        active: result?.active,
        version: 0,
        schoolYearId: newSchoolYearId.toString(),
        entityBaseId: result?.id?.toString(),
      });
      let resultSave = await this.repository.save(model);
      console.log('courseResolver');
      if (course) {
        await this.courseResolver.importCourseSchoolYearId(
          schoolId,
          result.id.toString(),
          resultSave.id.toString(),
          newSchoolYearId.toString(),
        );
      }
    }
    return true;
  }

  @Mutation(() => Boolean)
  async fixAllAcademicGradeSchoolAndSchoolYear() {
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
        if (result?.schoolId) {
          let schoolId;
          let school = await this.repositorySchool.findOneBy(result?.schoolId);
          if (school) {
            schoolId = school?.id?.toString();
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

  @Mutation(() => Boolean)
  async deleteAcademicGrade(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: AcademicGrade) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: AcademicGrade) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => EducationLevel, { nullable: true })
  async educationLevel(@Root() data: AcademicGrade) {
    let id = data.educationLevelId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryEducationLevel.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Specialty, { nullable: true })
  async specialty(@Root() data: AcademicGrade) {
    let id = data.specialtyId;
    if (id !== null && id !== undefined) {
      const result = await this.repositorySpecialty.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => GeneralAcademicCycle, { nullable: true })
  async generalAcademicCycle(@Root() data: AcademicGrade) {
    let id = data.generalAcademicCycleId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryGeneralAcademicCycle.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => GeneralAcademicGrade, { nullable: true })
  async generalAcademicGrade(@Root() data: AcademicGrade) {
    let id = data.generalAcademicGradeId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryGeneralAcademicGrade.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => School, { nullable: true })
  async school(@Root() data: AcademicGrade) {
    let id = data.schoolId;
    if (id !== null && id !== undefined) {
      const result = await this.repositorySchool.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => SchoolYear, { nullable: true })
  async schoolYear(@Root() data: AcademicGrade) {
    let id = data.schoolYearId;
    if (id !== null && id !== undefined) {
      const result = await this.repositorySchoolYear.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Number, { nullable: true })
  async countStudent(@Root() data: AcademicGrade) {
    let id = data.schoolId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryStudent.findBy({
        where: {
          academicGradeId: data?.id?.toString(),
        },
      });
      return result?.length;
    }
    return 0;
  }
}
