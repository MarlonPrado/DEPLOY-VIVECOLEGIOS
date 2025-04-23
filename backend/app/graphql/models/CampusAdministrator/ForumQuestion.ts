import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { IModelCampusData } from '../../interfaces/IModelCampusData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { SchoolYear } from '../SchoolAdministrator/SchoolYear';
import { Forum } from './Forum';

@Index("index_full", ["schoolYearId", "campusId", "schoolId", "forumId"])
@ObjectType({ description: 'The ForumQuestionQuestion model', implements: IModelCampusData })
@Entity()
export class ForumQuestion extends IModelCampusData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  details?: string;

  @Index("index_forumId")
  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  forumId?: string;

  @Field(() => Forum, { nullable: true })
  forum?: Forum;

  @Index("index_schoolYearId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  schoolYearId?: string;

  @Field({ nullable: true })
  schoolYear?: SchoolYear;
}

@ObjectType()
export class ForumQuestionEdge extends EdgeType('ForumQuestion', ForumQuestion) { }

@ObjectType()
export class ForumQuestionConnection extends ConnectionType<ForumQuestionEdge>(
  'ForumQuestion',
  ForumQuestionEdge
) { }
