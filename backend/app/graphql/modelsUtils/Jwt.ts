import { Field, ObjectType } from 'type-graphql';
import { Teacher } from '../models/CampusAdministrator/Teacher';
import { AuditLogin } from '../models/GeneralAdministrator/AuditLogin';
import { Campus } from '../models/GeneralAdministrator/Campus';
import { Menu } from '../models/GeneralAdministrator/Menu';
import { Role } from '../models/GeneralAdministrator/Role';
import { School } from '../models/GeneralAdministrator/School';
import { Student } from '../models/GeneralAdministrator/Student';

@ObjectType({ description: 'The User model' })
export class Jwt {
  @Field({ nullable: true })
  jwt?: string;

  @Field({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  profilePhoto?: string;

  @Field((_type) => [School], { nullable: true })
  schools?: School[];

  @Field((_type) => [Campus], { nullable: true })
  campus?: Campus[];

  @Field({ nullable: true })
  role?: Role;

  @Field((_type) => [Menu], { nullable: true })
  roleMenus?: [Menu];

  @Field({ nullable: true })
  student?: Student;

  @Field({ nullable: true })
  teacher?: Teacher;

  @Field((_type) => [Student], { nullable: true })
  students?: Student[];

  @Field({ nullable: true })
  lastLogin?: AuditLogin;
}
