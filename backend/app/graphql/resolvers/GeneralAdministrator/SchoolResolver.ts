import { connectionFromArraySlice } from 'graphql-relay';
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';
import { ObjectId } from 'mongodb';
import ShortUniqueId from 'short-unique-id';
import { finished } from 'stream/promises';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';

import {
  SchoolRepository,
  SchoolYearRepository,
  UserRepository,
} from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewSchool } from '../../inputs/GeneralAdministrator/NewSchool';
import { IContext } from '../../interfaces/IContext';
import { School, SchoolConnection } from '../../models/GeneralAdministrator/School';
import { User } from '../../models/GeneralAdministrator/User';
import { SchoolYear } from '../../models/SchoolAdministrator/SchoolYear';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(School)
export class SchoolResolver {
  @InjectRepository(School)
  private repository = SchoolRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(SchoolYear)
  private repositorySchoolYear = SchoolYearRepository;

  @Query(() => School, { nullable: true })
  async getSchool(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => SchoolConnection)
  async getAllSchool(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
  ): Promise<SchoolConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        result = await this.repository.findBy({
          order: { createdAt: 'DESC' },
        });
      } else {
        result = await this.repository.find();
      }
    } else {
      if (orderCreated) {
        result = await this.repository.findBy({
          where: {
            active: true,
          },
          order: { createdAt: 'DESC' },
        });
      } else {
        result = await this.repository.findBy({
          where: {
            active: true,
          },
        });
      }
    }
    let resultConn = new SchoolConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => School)
  async createSchool(@Arg('data') data: NewSchool, @Ctx() context: IContext): Promise<School> {
    let dataProcess: NewSchool = removeEmptyStringElements(data);
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

  @Mutation(() => School)
  async updateSchool(
    @Arg('data') data: NewSchool,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<School | null> {
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
  async changeActiveSchool(
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
  async deleteSchool(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext,
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @Mutation(() => Boolean)
  async schoolLogoUploadImage(
    @Arg('id', () => String) id: string,
    @Arg('file', () => GraphQLUpload, { nullable: true }) file: FileUpload,
    @Ctx() context: IContext,
  ) {
    //console.log(context);
    let updatedByUserId = context?.user?.authorization?.id;
    if (file?.filename) {
      var fs = require('fs');
      var dir = './public/uploads/school/profile/' + id;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const stream = file?.createReadStream();
      const uid = new ShortUniqueId({ length: 14 });
      const out = fs.createWriteStream(
        dir +
          '/' +
          uid() +
          '.' +
          file?.filename.slice(((file?.filename.lastIndexOf('.') - 1) >>> 0) + 2),
      );
      stream.pipe(out);
      await finished(out);
      let result = await this.repository.findOneBy(id);
      result = await this.repository.save({
        _id: new ObjectId(id),
        ...result,
        logo: out.path,
        updatedByUserId,
        version: (result?.version as number) + 1,
      });
      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => Boolean)
  async schoolImgPrincipalSignatureUploadImage(
    @Arg('id', () => String) id: string,
    @Arg('file', () => GraphQLUpload, { nullable: true }) file: FileUpload,
    @Ctx() context: IContext,
  ) {
    console.log('aca llega');
    let updatedByUserId = context?.user?.authorization?.id;
    if (file?.filename) {
      var fs = require('fs');
      var dir = './public/uploads/school/principalSignature/' + id;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const stream = file?.createReadStream();
      const uid = new ShortUniqueId({ length: 14 });
      const out = fs.createWriteStream(
        dir +
          '/' +
          uid() +
          '.' +
          file?.filename.slice(((file?.filename.lastIndexOf('.') - 1) >>> 0) + 2),
      );
      stream.pipe(out);
      await finished(out);
      let result = await this.repository.findOneBy(id);
      result = await this.repository.save({
        _id: new ObjectId(id),
        ...result,
        imgPrincipalSignature: out.path,
        updatedByUserId,
        version: (result?.version as number) + 1,
      });
      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => Boolean)
  async schoolImgSecretarySignatureUploadImage(
    @Arg('id', () => String) id: string,
    @Arg('file', () => GraphQLUpload, { nullable: true }) file: FileUpload,
    @Ctx() context: IContext,
  ) {
    //console.log(context);
    let updatedByUserId = context?.user?.authorization?.id;
    if (file?.filename) {
      var fs = require('fs');
      var dir = './public/uploads/school/secretarySignature/' + id;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const stream = file?.createReadStream();
      const uid = new ShortUniqueId({ length: 14 });
      const out = fs.createWriteStream(
        dir +
          '/' +
          uid() +
          '.' +
          file?.filename.slice(((file?.filename.lastIndexOf('.') - 1) >>> 0) + 2),
      );
      stream.pipe(out);
      await finished(out);
      let result = await this.repository.findOneBy(id);
      result = await this.repository.save({
        _id: new ObjectId(id),
        ...result,
        imgSecretarySignature: out.path,
        updatedByUserId,
        version: (result?.version as number) + 1,
      });
      return true;
    } else {
      return false;
    }
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: School) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: School) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => [SchoolYear], { nullable: true })
  async schoolYear(@Root() data: School) {
    let id = data.id.toString();
    if (id !== null && id !== undefined) {
      const result = await this.repositorySchoolYear.findBy({
        where: { schoolId: id, active: true },
        order: { createdAt: 'DESC' },
      });
      return result;
    }
    return null;
  }
}
