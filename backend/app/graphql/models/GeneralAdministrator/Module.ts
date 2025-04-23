import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';

@ObjectType({ description: 'The Module model', implements: IModelData })
@Entity()
export class Module extends IModelData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  url?: string;
}

@ObjectType()
export class ModuleEdge extends EdgeType('Module', Module) {}

@ObjectType()
export class ModuleConnection extends ConnectionType<ModuleEdge>('Module', ModuleEdge) {}
