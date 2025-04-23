import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { Role } from './Role';

@ObjectType({ description: 'The FrecuentQuestion model', implements: IModelData })
@Entity()
export class FrecuentQuestion extends IModelData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  question?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  response?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  order?: Number;

  @Index("index_rolesId")
  @Field(() => [String], { nullable: true })
  @Column({ nullable: true })
  rolesId?: String[];

  @Field(() => [Role], { nullable: true })
  roles?: Role[];
}

@ObjectType()
export class FrecuentQuestionEdge extends EdgeType('FrecuentQuestion', FrecuentQuestion) { }

@ObjectType()
export class FrecuentQuestionConnection extends ConnectionType<FrecuentQuestionEdge>('FrecuentQuestion', FrecuentQuestionEdge) { }
