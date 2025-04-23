import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { Role } from './Role';

@ObjectType({ description: 'The VideoTutorial model', implements: IModelData })
@Entity()
export class VideoTutorial extends IModelData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  image?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  miniumResolutionFileUrl?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  mediumResolutionFileUrl?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  maxResolutionFileUrl?: string;

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
export class VideoTutorialEdge extends EdgeType('VideoTutorial', VideoTutorial) { }

@ObjectType()
export class VideoTutorialConnection extends ConnectionType<VideoTutorialEdge>('VideoTutorial', VideoTutorialEdge) { }
