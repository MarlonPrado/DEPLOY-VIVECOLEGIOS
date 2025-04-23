import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';
import { IModelData } from '../../interfaces/IModelData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { GeneralAcademicAsignature } from './GeneralAcademicAsignature';
import { GeneralAcademicGrade } from './GeneralAcademicGrade';

@Index("index_full", ["generalAcademicAsignatureId", "generalAcademicGradeId"])
@ObjectType({ description: 'The GeneralBasicLearningRight model', implements: IModelData })
@Entity()
export class GeneralBasicLearningRight extends IModelData {
    @Field({ nullable: true })
    @Column({ nullable: true })
    dba?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    category?: string;

    @Index("index_generalAcademicAsignatureId")
    @Field({ nullable: true })
    @Column({ nullable: true })
    generalAcademicAsignatureId?: string;

    @Field({ nullable: true })
    generalAcademicAsignature?: GeneralAcademicAsignature;

    @Index("index_generalAcademicGradeId")
    @Field({ nullable: true })
    @Column({ nullable: true })
    generalAcademicGradeId?: string;

    @Field({ nullable: true })
    generalAcademicGrade?: GeneralAcademicGrade;
}

@ObjectType()
export class GeneralBasicLearningRightEdge extends EdgeType(
    'GeneralBasicLearningRight',
    GeneralBasicLearningRight
) { }

@ObjectType()
export class GeneralBasicLearningRightConnection extends ConnectionType<GeneralBasicLearningRightEdge>(
    'GeneralBasicLearningRight',
    GeneralBasicLearningRightEdge
) { }
