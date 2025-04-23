import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { AcademicAreaCourseYearValuationRepository, AcademicAreaRepository, CampusRepository, PerformanceLevelRepository, SchoolYearRepository, StudentRepository, UserRepository } from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewAcademicAreaCourseYearValuation } from '../../inputs/CampusAdministrator/NewAcademicAreaCourseYearValuation';
import { IContext } from '../../interfaces/IContext';
import { AcademicAreaCourseYearValuation, AcademicAreaCourseYearValuationConnection } from '../../models/CampusAdministrator/AcademicAreaCourseYearValuation';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { Student } from '../../models/GeneralAdministrator/Student';
import { User } from '../../models/GeneralAdministrator/User';
import { AcademicArea } from '../../models/SchoolAdministrator/AcademicArea';
import { PerformanceLevel } from '../../models/SchoolAdministrator/PerformanceLevel';
import { SchoolYear } from '../../models/SchoolAdministrator/SchoolYear';
import { ConnectionArgs } from '../../pagination/relaySpecs';

console.log("Area del Curso x AÑO EvaluativoR");

@Resolver(AcademicAreaCourseYearValuation)
export class AcademicAreaCourseYearValuationResolver {
  @InjectRepository(AcademicAreaCourseYearValuation)
  private repository = AcademicAreaCourseYearValuationRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(Campus)
  private repositoryCampus = CampusRepository;

  @InjectRepository(AcademicArea)
  private repositoryAcademicArea = AcademicAreaRepository;

  @InjectRepository(SchoolYear)
  private repositorySchoolYear = SchoolYearRepository;

  @InjectRepository(Student)
  private repositoryStudent = StudentRepository;

  @InjectRepository(PerformanceLevel)
  private repositoryPerformanceLevel = PerformanceLevelRepository;

  @Query(() => AcademicAreaCourseYearValuation, { nullable: true })
  async getAcademicAreaCourseYearValuation(@Arg('id', () => String) id: string) {
    console.log('[GET] AcademicAreaCourseYearValuation called with id:', id);
    const result = await this.repository.findOneBy(id);
    console.log('[GET] Result:', JSON.stringify(result, null, 2));
    return result;
  }

  @Query(() => AcademicAreaCourseYearValuationConnection)
  async getAllAcademicAreaCourseYearValuation(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('academicAreaId', () => String) academicAreaId: String,
    @Arg('schoolYearId', () => String) schoolYearId: String,
    @Arg('studentId', () => String, { nullable: true }) studentId: String,
  ): Promise<AcademicAreaCourseYearValuationConnection> {
    console.log('[GET ALL] Params:', {
      args,
      allData,
      orderCreated,
      academicAreaId,
      schoolYearId,
      studentId
    });

    let result;
    if (allData) {
      console.log('[GET ALL] Fetching all data (including inactive)');
      if (orderCreated) {
        console.log('[GET ALL] Ordered by creation date DESC');
        if (academicAreaId && schoolYearId && studentId) {
          console.log('[GET ALL] Filtering by academicAreaId, schoolYearId AND studentId');
          result = await this.repository.findBy({
            where: {
              academicAreaId,
              schoolYearId,
              studentId
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          console.log('[GET ALL] Filtering by academicAreaId AND schoolYearId only');
          result = await this.repository.findBy({
            where: {
              academicAreaId,
              schoolYearId,
            },
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        console.log('[GET ALL] No ordering specified');
        if (academicAreaId && schoolYearId && studentId) {
          console.log('[GET ALL] Filtering by academicAreaId, schoolYearId AND studentId');
          result = await this.repository.findBy({
            where: {
              academicAreaId,
              schoolYearId,
              studentId
            },
          });
        } else {
          console.log('[GET ALL] Filtering by academicAreaId AND schoolYearId only');
          result = await this.repository.findBy({
            where: {
              academicAreaId,
              schoolYearId,
            },
          });
        }
      }
    } else {
      console.log('[GET ALL] Fetching only active data');
      if (orderCreated) {
        console.log('[GET ALL] Ordered by creation date DESC');
        if (academicAreaId && schoolYearId && studentId) {
          console.log('[GET ALL] Filtering active by academicAreaId, schoolYearId AND studentId');
          result = await this.repository.findBy({
            where: {
              academicAreaId,
              schoolYearId,
              studentId,
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          console.log('[GET ALL] Filtering active by academicAreaId AND schoolYearId only');
          result = await this.repository.findBy({
            where: {
              academicAreaId,
              schoolYearId,
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        console.log('[GET ALL] No ordering specified');
        if (academicAreaId && schoolYearId && studentId) {
          console.log('[GET ALL] Filtering active by academicAreaId, schoolYearId AND studentId');
          result = await this.repository.findBy({
            where: {
              academicAreaId,
              schoolYearId,
              studentId,
              active: true,
            },
          });
        } else {
          console.log('[GET ALL] Filtering active by academicAreaId AND schoolYearId only');
          result = await this.repository.findBy({
            where: {
              academicAreaId,
              schoolYearId,
              active: true,
            },
          });
        }
      }
    }

    console.log('[GET ALL] Raw results count:', result.length);
    console.log('[GET ALL] Sample result:', result.length > 0 ? JSON.stringify(result[0], null, 2) : 'No results');

    let resultConn = new AcademicAreaCourseYearValuationConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    
    console.log('[GET ALL] Connection result:', {
      edges: resultConn.edges?.length,
      totalCount: resultConn.totalCount
    });
    
    return resultConn;
  }

  @Mutation(() => AcademicAreaCourseYearValuation)
  async createAcademicAreaCourseYearValuation(
    @Arg('data') data: NewAcademicAreaCourseYearValuation,
    @Ctx() context: IContext
  ): Promise<AcademicAreaCourseYearValuation> {
    console.log('[CREATE] Input data:', JSON.stringify(data, null, 2));
    console.log('[CREATE] Context user:', context?.user?.authorization?.id);
    
    let dataProcess: NewAcademicAreaCourseYearValuation = removeEmptyStringElements(data);
    console.log('[CREATE] Processed data:', JSON.stringify(dataProcess, null, 2));
    
    let createdByUserId = context?.user?.authorization?.id;
    const model = await this.repository.create({
      ...dataProcess,
      active: true,
      version: 0,
      createdByUserId,
    });
    
    console.log('[CREATE] Model to save:', JSON.stringify(model, null, 2));
    
    let result = await this.repository.save(model);
    console.log('[CREATE] Saved result:', JSON.stringify(result, null, 2));
    
    return result;
  }

  @Mutation(() => AcademicAreaCourseYearValuation)
  async updateAcademicAreaCourseYearValuation(
    @Arg('data') data: NewAcademicAreaCourseYearValuation,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<AcademicAreaCourseYearValuation | null> {
    console.log('[UPDATE] ID:', id);
    console.log('[UPDATE] Input data:', JSON.stringify(data, null, 2));
    console.log('[UPDATE] Context user:', context?.user?.authorization?.id);
    
    let dataProcess = removeEmptyStringElements(data);
    console.log('[UPDATE] Processed data:', JSON.stringify(dataProcess, null, 2));
    
    let updatedByUserId = context?.user?.authorization?.id;
    let originalData = await this.repository.findOneBy(id);
    console.log('[UPDATE] Original data:', JSON.stringify(originalData, null, 2));
    
    let result = await this.repository.save({
      _id: new ObjectId(id),
      ...originalData,
      ...dataProcess,
      version: (originalData?.version as number) + 1,
      updatedByUserId,
    });
    
    console.log('[UPDATE] Result:', JSON.stringify(result, null, 2));
    return result;
  }

  @Mutation(() => Boolean)
  async changeActiveAcademicAreaCourseYearValuation(
    @Arg('active', () => Boolean) active: boolean,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    console.log('[CHANGE ACTIVE] ID:', id, 'Active:', active);
    console.log('[CHANGE ACTIVE] Context user:', context?.user?.authorization?.id);
    
    let updatedByUserId = context?.user?.authorization?.id;
    let originalData = await this.repository.findOneBy(id);
    console.log('[CHANGE ACTIVE] Original data:', JSON.stringify(originalData, null, 2));
    
    let result = await this.repository.save({
      _id: new ObjectId(id),
      ...originalData,
      active: active,
      version: (originalData?.version as number) + 1,
      updatedByUserId,
    });
    
    console.log('[CHANGE ACTIVE] Result:', JSON.stringify(result, null, 2));
    console.log('[CHANGE ACTIVE] Operation success:', result.id ? 'YES' : 'NO');
    
    return result.id ? true : false;
  }

  @Mutation(() => Boolean)
  async deleteAcademicAreaCourseYearValuation(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    console.log('[DELETE] ID:', id);
    console.log('[DELETE] Context user:', context?.user?.authorization?.id);
    
    let data = await this.repository.findOneBy(id);
    console.log('[DELETE] Data to delete:', JSON.stringify(data, null, 2));
    
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    console.log('[DELETE] MongoDB result:', JSON.stringify(result, null, 2));
    console.log('[DELETE] Operation success:', result?.result?.ok === 1 ? 'YES' : 'NO');
    
    return result?.result?.ok === 1 ?? true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: AcademicAreaCourseYearValuation) {
    let id = data.createdByUserId;
    console.log('[FIELD RESOLVER] createdByUser for valuation:', data.id, 'User ID:', id);
    
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      console.log('[FIELD RESOLVER] createdByUser result:', JSON.stringify(result, null, 2));
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: AcademicAreaCourseYearValuation) {
    let id = data.updatedByUserId;
    console.log('[FIELD RESOLVER] updatedByUser for valuation:', data.id, 'User ID:', id);
    
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      console.log('[FIELD RESOLVER] updatedByUser result:', JSON.stringify(result, null, 2));
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Campus, { nullable: true })
  async campus(@Root() data: AcademicAreaCourseYearValuation) {
    let id = data.campusId;
    console.log('[FIELD RESOLVER] campus for valuation:', data.id, 'Campus ID:', id);
    
    if (id !== null && id !== undefined) {
      const result = await this.repositoryCampus.findOneBy(id);
      console.log('[FIELD RESOLVER] campus result:', JSON.stringify(result, null, 2));
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => AcademicArea, { nullable: true })
  async academicAsignatureCourse(@Root() data: AcademicAreaCourseYearValuation) {
    let id = data.academicAreaId;
    console.log('[FIELD RESOLVER] academicAsignatureCourse for valuation:', data.id, 'AcademicArea ID:', id);
    
    if (id !== null && id !== undefined) {
      const result = await this.repositoryAcademicArea.findOneBy(id);
      console.log('[FIELD RESOLVER] academicAsignatureCourse result:', JSON.stringify(result, null, 2));
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => SchoolYear, { nullable: true })
  async schoolYear(@Root() data: AcademicAreaCourseYearValuation) {
    let id = data.schoolYearId;
    console.log('[FIELD RESOLVER] schoolYear for valuation:', data.id, 'SchoolYear ID:', id);
    
    if (id !== null && id !== undefined) {
      const result = await this.repositorySchoolYear.findOneBy(id);
      console.log('[FIELD RESOLVER] schoolYear result:', JSON.stringify(result, null, 2));
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Student, { nullable: true })
  async student(@Root() data: AcademicAreaCourseYearValuation) {
    let id = data.studentId;
    console.log('[FIELD RESOLVER] student for valuation:', data.id, 'Student ID:', id);
    
    if (id !== null && id !== undefined) {
      const result = await this.repositoryStudent.findOneBy(id);
      console.log('[FIELD RESOLVER] student result:', JSON.stringify(result, null, 2));
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => PerformanceLevel, { nullable: true })
  async performanceLevel(@Root() data: AcademicAreaCourseYearValuation) {
    let id = data.performanceLevelId;
    console.log('[FIELD RESOLVER] performanceLevel for valuation:', data.id, 'PerformanceLevel ID:', id);
    
    if (id !== null && id !== undefined) {
      const result = await this.repositoryPerformanceLevel.findOneBy(id);
      console.log('[FIELD RESOLVER] performanceLevel result:', JSON.stringify(result, null, 2));
      return result;
    }
    return null;
  }
}