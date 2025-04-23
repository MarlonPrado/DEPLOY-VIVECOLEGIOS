import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import { IModelSchoolData } from '../../interfaces/IModelSchoolData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';

@ObjectType({ description: 'The ObserverAnnotationType model', implements: IModelSchoolData })
@Entity()
export class ObserverAnnotationType extends IModelSchoolData {
  @Field({ nullable: true })
  @Column({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;
}

@ObjectType()
export class ObserverAnnotationTypeEdge extends EdgeType('ObserverAnnotationType', ObserverAnnotationType) { }

@ObjectType()
export class ObserverAnnotationTypeConnection extends ConnectionType<ObserverAnnotationTypeEdge>('ObserverAnnotationType', ObserverAnnotationTypeEdge) { }