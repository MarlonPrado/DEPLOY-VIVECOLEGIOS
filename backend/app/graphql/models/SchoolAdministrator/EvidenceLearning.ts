import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';
import { IModelSchoolData } from '../../interfaces/IModelSchoolData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { Learning } from './Learning';

@Index("index_full", ["learningId", "schoolId"])
@ObjectType({ description: 'The EvidenceLearning model', implements: IModelSchoolData })
@Entity()
export class EvidenceLearning extends IModelSchoolData {
    @Field({ nullable: true })
    @Column({ nullable: true })
    statement?: string;

    @Index("index_learningId")
    @Field({ nullable: true })
    @Column({ nullable: true })
    learningId?: string;

    @Field({ nullable: true })
    learning?: Learning;
}

@ObjectType()
export class EvidenceLearningEdge extends EdgeType(
    'EvidenceLearning',
    EvidenceLearning
) { }

@ObjectType()
export class EvidenceLearningConnection extends ConnectionType<EvidenceLearningEdge>(
    'EvidenceLearning',
    EvidenceLearningEdge
) { }
