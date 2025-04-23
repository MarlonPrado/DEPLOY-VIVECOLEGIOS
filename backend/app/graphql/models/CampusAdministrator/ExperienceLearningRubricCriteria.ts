import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';
import { IModelCampusData } from '../../interfaces/IModelCampusData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { EvidenceLearning } from '../SchoolAdministrator/EvidenceLearning';
import { ExperienceLearning } from './ExperienceLearning';
import { ExperienceLearningRubricCriteriaPerformanceLevel } from './ExperienceLearningRubricCriteriaPerformanceLevel';

@Index("index_full", ["experienceLearningId", "evidenceLearningId", "campusId"])
@ObjectType({ description: 'The ExperienceLearningRubricCriteria model', implements: IModelCampusData })
@Entity()
export class ExperienceLearningRubricCriteria extends IModelCampusData {
    @Index("index_experienceLearningId")
    @Field({ nullable: true })
    @Column({ nullable: true })
    experienceLearningId?: string;

    @Field({ nullable: true })
    experienceLearning?: ExperienceLearning;

    @Index("index_evidenceLearningId")
    @Field({ nullable: true })
    @Column({ nullable: true })
    evidenceLearningId?: String;

    @Field(() => EvidenceLearning, { nullable: true })
    evidenceLearnig?: EvidenceLearning;

    @Field({ nullable: true })
    @Column({ nullable: true })
    weight?: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    criteria?: String;

    @Field(() => [ExperienceLearningRubricCriteriaPerformanceLevel], { nullable: true })
    @Column({ nullable: true })
    experienceLearningRubricCriteriaPerformanceLevel?: ExperienceLearningRubricCriteriaPerformanceLevel[];

}

@ObjectType()
export class ExperienceLearningRubricCriteriaEdge extends EdgeType('ExperienceLearningRubricCriteria', ExperienceLearningRubricCriteria) { }

@ObjectType()
export class ExperienceLearningRubricCriteriaConnection extends ConnectionType<ExperienceLearningRubricCriteriaEdge>('ExperienceLearningRubricCriteria', ExperienceLearningRubricCriteriaEdge) { }
