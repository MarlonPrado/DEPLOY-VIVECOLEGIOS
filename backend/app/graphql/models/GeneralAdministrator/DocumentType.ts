import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';

@ObjectType({ description: 'The Document Type model', implements: IModelData })
@Entity()
export class DocumentType extends IModelData {
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
export class DocumentTypeEdge extends EdgeType('DocumentType', DocumentType) {}

@ObjectType()
export class DocumentTypeConnection extends ConnectionType<DocumentTypeEdge>(
  'DocumentType',
  DocumentTypeEdge
) {}
