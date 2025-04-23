import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';
import { IModelSchoolData } from '../../interfaces/IModelSchoolData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { GeneralBasicLearningRight } from '../GeneralAdministrator/GeneralBasicLearningRight';
import { AcademicAsignature } from './AcademicAsignature';
import { AcademicGrade } from './AcademicGrade';
import { AcademicPeriod } from './AcademicPeriod';
import { AcademicStandard } from './AcademicStandard';

@Index("index_full", ["academicAsignatureId", "generalBasicLearningRightId", "academicStandardId", "academicGradeId", "academicPeriodsId", "schoolId"])
@ObjectType({ description: 'The Learning model', implements: IModelSchoolData })
@Entity()
export class Learning extends IModelSchoolData {
    @Field({ nullable: true })
    @Column({ nullable: true })
    statement?: string;

    @Index("index_academicAsignatureId")
    @Field({ nullable: true })
    @Column({ nullable: true })
    academicAsignatureId?: string;

    @Field({ nullable: true })
    academicAsignature?: AcademicAsignature;

    @Index("index_generalBasicLearningRightId")
    @Field({ nullable: true })
    @Column({ nullable: true })
    generalBasicLearningRightId?: string;

    @Field({ nullable: true })
    generalBasicLearningRight?: GeneralBasicLearningRight;

    @Index("index_academicStandardId")
    @Field({ nullable: true })
    @Column({ nullable: true })
    academicStandardId?: string;

    @Field({ nullable: true })
    academicStandard?: AcademicStandard;

    @Index("index_academicGradeId")
    @Field({ nullable: true })
    @Column({ nullable: true })
    academicGradeId?: string;

    @Field({ nullable: true })
    academicGrade?: AcademicGrade;

    @Index("index_academicPeriodsId")
    @Field(() => [String], { nullable: true })
    @Column({ nullable: true })
    academicPeriodsId?: String[];;

    @Field(() => [AcademicPeriod], { nullable: true })
    academicPeriods?: AcademicPeriod[];
}

@ObjectType()
export class LearningEdge extends EdgeType(
    'Learning',
    Learning
) { }

@ObjectType()
export class LearningConnection extends ConnectionType<LearningEdge>(
    'Learning',
    LearningEdge
) { }
