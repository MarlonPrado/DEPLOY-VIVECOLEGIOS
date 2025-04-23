import { Field, InputType } from 'type-graphql';
import { Role } from '../../models/GeneralAdministrator/Role';

@InputType()
export class NewRole implements Partial<Role> {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  isSchoolAdministrator?: boolean;

  @Field({ nullable: true })
  isSchoolAdministrative?: boolean;

  @Field({ nullable: true })
  isCampusAdministrator?: boolean;

  @Field({ nullable: true })
  isCampusCoordinator?: boolean;

  @Field({ nullable: true })
  isStudent?: boolean;

  @Field({ nullable: true })
  isTeacher?: boolean;

  @Field({ nullable: true })
  isGuardian?: boolean;
}
