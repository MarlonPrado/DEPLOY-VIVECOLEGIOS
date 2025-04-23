import bcrypt from 'bcrypt';
import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';

import {
  CampusRepository,
  PlantaDocenteRepository,
  SchoolRepository,
  SchoolYearRepository,
  TeacherRepository,
  UserRepository,
} from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewTeacher } from '../../inputs/CampusAdministrator/NewTeacher';
import { NewUser } from '../../inputs/GeneralAdministrator/NewUser';
import { IContext } from '../../interfaces/IContext';
import { Teacher, TeacherConnection } from '../../models/CampusAdministrator/Teacher';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { School } from '../../models/GeneralAdministrator/School';
import { User } from '../../models/GeneralAdministrator/User';
import { SchoolYear } from '../../models/SchoolAdministrator/SchoolYear';
import { ConnectionArgs } from '../../pagination/relaySpecs';
import { PlantaDocente } from './../../models/Data/PlantaDocente';

const BCRYPT_SALT_ROUNDS = 12;

@Resolver(Teacher)
export class TeacherResolver {
  @InjectRepository(Teacher)
  private repository = TeacherRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(School)
  private repositorySchool = SchoolRepository;

  @InjectRepository(SchoolYear)
  private repositorySchoolYear = SchoolYearRepository;

  @InjectRepository(Campus)
  private repositoryCampus = CampusRepository;

  @InjectRepository(PlantaDocente)
  private repositoryPlantaDocente = PlantaDocenteRepository;

  @Query(() => Teacher, { nullable: true })
  async getTeacher(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => TeacherConnection)
  async getAllTeacher(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('schoolId', () => [String]) schoolId: String[],
    @Arg('campusId', () => [String], { nullable: true }) campusId: String[],
    @Arg('schoolYearId', () => String, { nullable: true }) schoolYearId: String,
  ): Promise<TeacherConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        if (campusId) {
          result = await this.repository.findBy({
            where: { schoolId: { $in: schoolId }, campusId: { $in: campusId }, schoolYearId },
            order: { createdAt: 'DESC' },
          });
        } else {
          result = await this.repository.findBy({
            where: { schoolId: { $in: schoolId }, schoolYearId },
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        if (campusId) {
          result = await this.repository.findBy({
            where: { schoolId: { $in: schoolId }, campusId: { $in: campusId }, schoolYearId },
          });
        } else {
          result = await this.repository.findBy({
            where: { schoolId: { $in: schoolId }, schoolYearId },
          });
        }
      }
    } else {
      if (orderCreated) {
        if (campusId) {
          result = await this.repository.findBy({
            where: {
              schoolId: { $in: schoolId },
              campusId: { $in: campusId },
              schoolYearId,
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              schoolId: { $in: schoolId },
              schoolYearId,
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        if (campusId) {
          result = await this.repository.findBy({
            where: {
              schoolId: { $in: schoolId },
              campusId: { $in: campusId },
              schoolYearId,
              active: true,
            },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              schoolId: { $in: schoolId },
              schoolYearId,
              active: true,
            },
          });
        }
      }
    }
    let resultConn = new TeacherConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => Teacher)
  async createTeacher(@Arg('data') data: NewTeacher, @Ctx() context: IContext): Promise<Teacher> {
    let dataProcess: NewTeacher = removeEmptyStringElements(data);
    let dataUserProcess: NewUser = removeEmptyStringElements(dataProcess.newUser);
    let createdByUserId = context?.user?.authorization?.id;
    delete dataProcess.newUser;
    let user = await this.repositoryUser.findBy({ documentNumber: dataUserProcess.documentNumber });
    if (user.length > 0) {
      let teacher = await this.repository.findBy({
        userId: user[0]?.id?.toString(),
        schoolYearId: dataProcess.schoolYearId,
      });
      if (teacher.length == 0) {
        const model = await this.repository.create({
          ...dataProcess,
          userId: user[0].id.toString(),
          active: true,
          version: 0,
          createdByUserId,
        });
        let result = await this.repository.save(model);
        return result;
      }
      return new Teacher();
    } else {
      if (dataUserProcess.documentNumber != null) {
        let passwordHash = await bcrypt
          .hash(dataUserProcess.documentNumber, BCRYPT_SALT_ROUNDS)
          .then(function (hashedPassword: any) {
            return hashedPassword;
          });
        dataUserProcess.password = passwordHash;
      }
      const modelUser = await this.repositoryUser.create({
        ...dataUserProcess,
        username: dataUserProcess.documentNumber,
        active: true,
        version: 0,
        createdByUserId,
      });
      let resultUser = await this.repositoryUser.save(modelUser);
      const model = await this.repository.create({
        ...dataProcess,
        userId: resultUser.id.toString(),
        active: true,
        version: 0,
        createdByUserId,
      });
      let result = await this.repository.save(model);
      return result;
    }
  }

  @Mutation(() => Boolean)
  public async createAllInitialsTeachers() {
    let dataSchoolCreate = [
      '254003002278',
      '254003000364',
      '254003000062',
      '254003000445',
      '254003000046',
      '254003000381',
      '254003002359',
      '154003000823',
      '254003000330',
      '254003000526',
      '154003001668',
      '254051000821',
      '254099000289',
      '254109000177',
      '254109000096',
      '154128000680',
      '154128000019',
      '254172000233',
      '254172000039',
      '254174000371',
      '254206000149',
      '154206000012',
      '254206001030',
      '254206000041',
      '254206000157',
      '154206000021',
      '254206001196',
      '254206001102',
      '254223000691',
      '254245000776',
      '254245000270',
      '154245000607',
      '254245000041',
      '254245001292',
      '254810000629',
      '254670000488',
      '254670000445',
      '154670001056',
      '254810000106',
      '254261000166',
      '254261000476',
      '154261000099',
      '254261000484',
      '154313000033',
      '254313000054',
      '254344000338',
      '254344000133',
      '254344000290',
      '154344000465',
      '254385000270',
      '254385000121',
      '254398000490',
      '254398000368',
      '254398000724',
      '254398000121',
      '254398000732',
      '154377000207',
      '154405000986',
      '354405000098',
      '254874000363',
      '254874000568',
      '154418000331',
      '154480000118',
      '254480000066',
      '254480000139',
      '154498000018',
      '154498000085',
      '254498000721',
      '154498001944',
      '254498000705',
      '254498000144',
      '154498001928',
      '154498000069',
      '154498002223',
      '254498000209',
      '154518000753',
      '154518000273',
      '254001004761',
      '154660000698',
      '254660000200',
      '254670000798',
      '254670000470',
      '254670000364',
      '254670001301',
      '254720001677',
      '254720000034',
      '254720000930',
      '254743000104',
      '254800000582',
      '254800000108',
      '154810003020',
      '254810000696',
      '254810000386',
      '254810002265',
      '254810000165',
      '254810002061',
      '254810001013',
      '254820000759',
      '254820000368',
      '254820000384',
      '254820000856',
      '254820000848',
      '254874000070',
    ];
    let schools = await this.repositorySchool.findBy({
      where: { daneCode: { $in: dataSchoolCreate } },
    });
    let count = 0;
    for (let school of schools) {
      console.log('school', school);
      let schoolYear = await this.repositorySchoolYear.findBy({
        where: { schoolYear: 2024, schoolId: school?.id?.toString(), active: true },
      });
      let data = await this.repositoryPlantaDocente.findBy({
        where: { school_id: school?.daneCode, procesado: null },
      });
      console.log('data', data?.length);
      console.log('schoolYear', schoolYear);
      if (schoolYear?.length == 1) {
        for (let docente of data) {
          if (
            docente.documento &&
            docente.school_id &&
            docente.sede_dane &&
            docente.cargo === 'Docente'
          ) {
            if (
              docente.documento.length > 1 &&
              docente.school_id.length > 1 &&
              docente.sede_dane.length > 1
            ) {
              let user = await this.repositoryUser.findBy({
                username: docente.documento,
                active: true,
              });
              let campus = await this.repositoryCampus.findBy({
                where: { consecutive: docente.sede_dane },
              });
              let resultUser = null;
              if (user.length === 0) {
                let passwordHash = await bcrypt
                  .hash(docente.documento ? docente.documento : 'VIVE2022', BCRYPT_SALT_ROUNDS)
                  .then(function (hashedPassword: any) {
                    return hashedPassword;
                  });
                let fechaNacimiento = docente.fechanacimiento?.split('/');
                const modelUser = await this.repositoryUser.create({
                  name: docente.empleado,
                  lastName: '',
                  username: docente.documento,
                  password: passwordHash,
                  documentNumber: docente.documento,
                  documentTypeId: '60cfc792445f133f9e261eae',
                  genderId:
                    docente.sexo == 'F' ? '60cfc51e445f133f9e261ead' : '60ecc36d6c716a21bee51e00',
                  birthdate: fechaNacimiento
                    ? new Date(
                        Number(fechaNacimiento[2]),
                        Number(fechaNacimiento[1]) - 1,
                        Number(fechaNacimiento[0]),
                      )
                    : undefined,
                  phone: docente.telefono,
                  email: docente.email,
                  roleId: '619551da882a2fb6525a3079',
                  active: true,
                  version: 0,
                });
                //console.log(modelUser);
                resultUser = await this.repositoryUser.save(modelUser);
              } else {
                resultUser = user[0];
              }

              let teacher = await this.repository.findBy({
                userId: resultUser?.id.toString(),
                schoolYearId: schoolYear[0]?.id?.toString(),
                active: true,
              });
              if (teacher?.length == 0) {
                const model = await this.repository.create({
                  schoolId: [school.id.toString()],
                  campusId: campus.length === 1 ? [campus[0].id.toString()] : [],
                  userId: resultUser?.id.toString(),
                  schoolYearId: schoolYear[0]?.id?.toString(),
                  active: true,
                  version: 0,
                });
                //console.log(model);
                let result = await this.repository.save(model);
              }

              const modelPlantaDocente = await this.repositoryPlantaDocente.create({
                ...docente,
                procesado: true,
              });
              count += 1;
              //console.log(modelPlantaDocente);
              let resultPLantaDocente = await this.repositoryPlantaDocente.save(modelPlantaDocente);
              console.log('procesados ' + count);
            }
          }
        }
      }
    }
    return true;
  }

  @Mutation(() => Teacher)
  async updateTeacher(
    @Arg('data') data: NewTeacher,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<Teacher | null> {
    let dataProcess = removeEmptyStringElements(data);
    let updatedByUserId = context?.user?.authorization?.id;
    let result = await this.repository.findOneBy(id);
    let dataUserProcess: NewUser = removeEmptyStringElements(dataProcess?.newUser);
    let resultUser = await this.repositoryUser.findOneBy(result?.userId?.toString());
    resultUser = await this.repositoryUser.save({
      _id: new ObjectId(result?.userId?.toString()),
      ...resultUser,
      ...dataUserProcess,
      version: (result?.version as number) + 1,
      updatedByUserId,
    });
    delete dataProcess?.newUser;
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
  async changeActiveTeacher(
    @Arg('active', () => Boolean) active: boolean,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<Boolean | null> {
    let updatedByUserId = context?.user?.authorization?.id;
    let result = await this.repository.findOneBy(id);
    let resultUser = await this.repositoryUser.findOneBy(result?.userId?.toString());
    resultUser = await this.repositoryUser.save({
      _id: new ObjectId(result?.userId?.toString()),
      ...resultUser,
      active: active,
      version: (result?.version as number) + 1,
      updatedByUserId,
    });
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
  async importTeacherSchoolYearId(
    @Arg('schoolId', () => String) schoolId: String,
    @Arg('oldSchoolYearId', () => String) oldSchoolYearId: String,
    @Arg('newSchoolYearId', () => String) newSchoolYearId: String,
  ) {
    let results = await this.repository.findBy({
      where: { schoolId, schoolYearId: oldSchoolYearId },
    });
    console.log('IMPORT', results?.length);
    for (let result of results) {
      const model = await this.repository.create({
        attentionSchedule: result.attentionSchedule,
        userId: result.userId,
        campusId: result.campusId,
        schoolId: result.schoolId,
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
  async fixAllTeacherSchoolAndSchoolYear() {
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
            schoolId: [schoolYear?.schoolId + ''],
            version: (result?.version as number) + 1,
          });
        }
      } else {
        if (result?.schoolId || result?.campusId) {
          let schoolId;
          if (result?.schoolId) {
            let school = await this.repositorySchool.findOneBy(result?.schoolId[0]);
            if (school) {
              schoolId = school?.id?.toString();
            }
          } else {
            if (result?.campusId) {
              let campus = await this.repositoryCampus.findOneBy(result?.campusId[0]);
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
                schoolId: [schoolYears[0]?.schoolId + ''],
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
  async deleteTeacher(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: Teacher) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: Teacher) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async user(@Root() data: Teacher) {
    let id = data.userId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => School, { nullable: true })
  async school(@Root() data: Teacher) {
    let ids = data.schoolId;
    if (ids !== null && ids !== undefined) {
      let dataIds: any[] = [];
      ids.forEach(async (id: any) => {
        dataIds.push(new ObjectId(id));
      });
      const result = await this.repositorySchool.findBy({ where: { _id: { $in: dataIds } } });
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => SchoolYear, { nullable: true })
  async schoolYear(@Root() data: Teacher) {
    let id = data.schoolYearId;
    if (id !== null && id !== undefined) {
      const result = await this.repositorySchoolYear.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => [Campus], { nullable: true })
  async campus(@Root() data: Teacher) {
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
}
