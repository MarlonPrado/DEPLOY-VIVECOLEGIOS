import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { AcademicArea } from './../../models/SchoolAdministrator/AcademicArea';

import {
  AcademicAreaRepository,
  AcademicAsignatureRepository,
  AcademicGradeRepository,
  GeneralAcademicAsignatureRepository,
  GradeAssignmentRepository,
  SchoolRepository,
  SchoolYearRepository,
  UserRepository,
} from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewAcademicAsignature } from '../../inputs/SchoolAdministrator/NewAcademicAsignature';
import { IContext } from '../../interfaces/IContext';
import { GeneralAcademicAsignature } from '../../models/GeneralAdministrator/GeneralAcademicAsignature';
import { School } from '../../models/GeneralAdministrator/School';
import { User } from '../../models/GeneralAdministrator/User';
import {
  AcademicAsignature,
  AcademicAsignatureConnection,
} from '../../models/SchoolAdministrator/AcademicAsignature';
import { AcademicGrade } from '../../models/SchoolAdministrator/AcademicGrade';
import { GradeAssignment } from '../../models/SchoolAdministrator/GradeAssignment';
import { SchoolYear } from '../../models/SchoolAdministrator/SchoolYear';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(AcademicAsignature)
export class AcademicAsignatureResolver {
  @InjectRepository(AcademicAsignature)
  private repository = AcademicAsignatureRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(AcademicArea)
  private repositoryAcademicArea = AcademicAreaRepository;

  @InjectRepository(School)
  private repositorySchool = SchoolRepository;

  @InjectRepository(SchoolYear)
  private repositorySchoolYear = SchoolYearRepository;

  @InjectRepository(GeneralAcademicAsignature)
  private repositoryGeneralAcademicAsignature = GeneralAcademicAsignatureRepository;

  @InjectRepository(GradeAssignment)
  private repositoryGradeAssignment = GradeAssignmentRepository;

  @InjectRepository(AcademicGrade)
  private repositoryAcademicGrade = AcademicGradeRepository;

  @Query(() => AcademicAsignature, { nullable: true })
  async getAcademicAsignature(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => AcademicAsignatureConnection)
  async getAllAcademicAsignature(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('schoolId', () => String) schoolId: String,
    @Arg('academicAreaId', () => String, { nullable: true }) academicAreaId: string,
    @Arg('schoolYearId', () => String, { nullable: true }) schoolYearId: String,
  ): Promise<AcademicAsignatureConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        if (academicAreaId) {
          result = await this.repository.findBy({
            where: { schoolId, academicAreaId, schoolYearId },
            order: { createdAt: 'DESC' },
          });
        } else {
          result = await this.repository.findBy({
            where: { schoolId, schoolYearId },
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        if (academicAreaId) {
          result = await this.repository.findBy({
            where: { schoolId, academicAreaId, schoolYearId },
          });
        } else {
          result = await this.repository.findBy({ where: { schoolId, schoolYearId } });
        }
      }
    } else {
      if (orderCreated) {
        if (academicAreaId) {
          result = await this.repository.findBy({
            where: {
              schoolId,
              academicAreaId,
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
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        if (academicAreaId) {
          result = await this.repository.findBy({
            where: {
              schoolId,
              schoolYearId,
              academicAreaId,
              active: true,
            },
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
    }
    let resultConn = new AcademicAsignatureConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Query(() => AcademicAsignatureConnection)
  async getAllAcademicAsignatureNotAssignedInAcademicGrade(
    @Args() args: ConnectionArgs,
    @Arg('schoolId', () => String) schoolId: String,
    @Arg('academicGradeId', () => String) academicGradeId: string,
    @Arg('schoolYearId', () => String, { nullable: true }) schoolYearId: String,
  ): Promise<AcademicAsignatureConnection> {
    let gradeAssignmentAsignatureIds: any[] = [];
    let gradeAssignmentsAcademicGrade = await this.repositoryGradeAssignment.findBy({
      where: {
        schoolId,
        academicGradeId,
        schoolYearId,
        active: true,
      },
    });
    gradeAssignmentsAcademicGrade.forEach((gradeAssignmentAcademicGrade: any) => {
      gradeAssignmentAsignatureIds.push(
        new ObjectId(gradeAssignmentAcademicGrade.academicAsignatureId),
      );
    });
    let result;
    result = await this.repository.findBy({
      where: {
        _id: { $nin: gradeAssignmentAsignatureIds },
        schoolId,
        schoolYearId,
        active: true,
      },
    });
    let resultConn = new AcademicAsignatureConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => AcademicAsignature)
  async createAcademicAsignature(
    @Arg('data') data: NewAcademicAsignature,
    @Ctx() context: IContext,
  ): Promise<AcademicAsignature> {
    let dataProcess: NewAcademicAsignature = removeEmptyStringElements(data);
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

  @Mutation(() => AcademicAsignature)
  async updateAcademicAsignature(
    @Arg('data') data: NewAcademicAsignature,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<AcademicAsignature | null> {
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
  async changeActiveAcademicAsignature(
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
  async deleteAcademicAsignature(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @Mutation(() => Boolean)
  async importAcademicAsignatureSchoolYearId(
    @Arg('schoolId', () => String) schoolId: String,
    @Arg('oldAcademicAreaId', () => String) oldAcademicAreaId: String,
    @Arg('newAcademicAreaId', () => String) newAcademicAreaId: String,
    @Arg('newSchoolYearId', () => String) newSchoolYearId: String,
  ) {
    let results = await this.repository.findBy({
      where: { schoolId, academicAreaId: oldAcademicAreaId },
    });
    console.log('IMPORT', results?.length);
    for (let result of results) {
      let academicGradesId = [];
      if (result?.academicGradeId) {
        for (let academicGradeId of result?.academicGradeId) {
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
        abbreviation: result.abbreviation,
        code: result.code,
        minWeight: result.minWeight,
        maxWeight: result.maxWeight,
        academicAreaId: newAcademicAreaId.toString(),
        academicGradeId: academicGradesId,
        schoolId: result.schoolId,
        generalAcademicAsignatureId: result.generalAcademicAsignatureId,
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
  async fixAllAcademicAsignatureSchoolAndSchoolYear() {
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
              console.log('school -1: ', number);
              result = await this.repository.save({
                _id: new ObjectId(result?.id?.toString()),
                ...result,
                active: false,
                version: -1,
              });
            }
          } else {
            console.log('school -2: ', number);
            result = await this.repository.save({
              _id: new ObjectId(result?.id?.toString()),
              ...result,
              active: false,
              version: -1,
            });
          }
        } else {
          if (result?.academicAreaId) {
            let academicArea = await this.repositoryAcademicArea.findOneBy(result?.academicAreaId);
            if (academicArea && academicArea?.schoolId && academicArea?.schoolYearId) {
              console.log('school 1: ', number);
              result = await this.repository.save({
                _id: new ObjectId(result?.id?.toString()),
                ...result,
                schoolId: academicArea?.schoolId,
                schoolYearId: academicArea?.schoolYearId,
                version: (result?.version as number) + 1,
              });
            }
          } else {
            console.log('school -3: ', number);
            result = await this.repository.save({
              _id: new ObjectId(result?.id?.toString()),
              ...result,
              active: false,
              version: -1,
            });
          }
        }
      }
    }
    return true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: AcademicAsignature) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: AcademicAsignature) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => AcademicArea, { nullable: true })
  async academicArea(@Root() data: AcademicAsignature) {
    let id = data.academicAreaId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryAcademicArea.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => GeneralAcademicAsignature, { nullable: true })
  async generalAcademicAsignature(@Root() data: AcademicAsignature) {
    let id = data.generalAcademicAsignatureId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryGeneralAcademicAsignature.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => School, { nullable: true })
  async school(@Root() data: AcademicAsignature) {
    let id = data.schoolId;
    if (id !== null && id !== undefined) {
      const result = await this.repositorySchool.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => SchoolYear, { nullable: true })
  async schoolYear(@Root() data: AcademicAsignature) {
    let id = data.schoolYearId;
    if (id !== null && id !== undefined) {
      const result = await this.repositorySchoolYear.findOneBy(id);
      return result;
    }
    return null;
  }
}
