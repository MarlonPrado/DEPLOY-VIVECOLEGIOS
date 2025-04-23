import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { IModelCampusData } from '../../interfaces/IModelCampusData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { SchoolYear } from '../SchoolAdministrator/SchoolYear';
import { ForumQuestion } from './ForumQuestion';

@Index("index_full", ["schoolYearId", "campusId", "schoolId", "forumQuestionId"])
@ObjectType({ description: 'The ForumInteraction model', implements: IModelCampusData })
@Entity()
export class ForumInteraction extends IModelCampusData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  comment?: string;

  @Index("index_forumQuestionId")
  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  forumQuestionId?: string;

  @Field(() => ForumQuestion, { nullable: true })
  forumQuestion?: ForumQuestion;

  @Index("index_schoolYearId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  schoolYearId?: string;

  @Field({ nullable: true })
  schoolYear?: SchoolYear;
}

@ObjectType()
export class ForumInteractionEdge extends EdgeType('ForumInteraction', ForumInteraction) { }

@ObjectType()
export class ForumInteractionConnection extends ConnectionType<ForumInteractionEdge>(
  'ForumInteraction',
  ForumInteractionEdge
) { }
