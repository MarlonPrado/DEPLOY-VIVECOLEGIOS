import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';

@ObjectType({ description: 'The Role model', implements: IModelData })
@Entity()
export class Role extends IModelData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  isSchoolAdministrator?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  isSchoolAdministrative?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  isCampusAdministrator?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  isCampusCoordinator?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  isStudent?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  isTeacher?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  isGuardian?: boolean;
}

@ObjectType()
export class RoleEdge extends EdgeType('Role', Role) {}

@ObjectType()
export class RoleConnection extends ConnectionType<RoleEdge>('Role', RoleEdge) {}
