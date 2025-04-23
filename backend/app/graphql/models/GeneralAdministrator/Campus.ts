import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';
import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { School } from './School';

@ObjectType({ description: 'The Campus model', implements: IModelData })
@Entity()
export class Campus extends IModelData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  daneCodeCampus?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  consecutive?: string;

  @Index("index_schoolId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  schoolId?: string;

  @Field({ nullable: true })
  school?: School;
}

@ObjectType()
export class CampusEdge extends EdgeType('Campus', Campus) { }

@ObjectType()
export class CampusConnection extends ConnectionType<CampusEdge>('Campus', CampusEdge) { }
