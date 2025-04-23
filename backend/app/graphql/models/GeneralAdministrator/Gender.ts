import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';

@ObjectType({ description: 'The Gender model', implements: IModelData })
@Entity()
export class Gender extends IModelData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;
}

@ObjectType()
export class GenderEdge extends EdgeType('Gender', Gender) {}

@ObjectType()
export class GenderConnection extends ConnectionType<GenderEdge>('Gender', GenderEdge) {}
