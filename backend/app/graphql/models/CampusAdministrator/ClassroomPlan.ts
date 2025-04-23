import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';
import { IModelCampusData } from '../../interfaces/IModelCampusData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { GeneralBasicLearningRight } from '../GeneralAdministrator/GeneralBasicLearningRight';
import { AcademicAsignature } from '../SchoolAdministrator/AcademicAsignature';
import { AcademicGrade } from '../SchoolAdministrator/AcademicGrade';
import { AcademicPeriod } from '../SchoolAdministrator/AcademicPeriod';
import { AcademicStandard } from '../SchoolAdministrator/AcademicStandard';
import { Learning } from '../SchoolAdministrator/Learning';
import { AcademicAsignatureCourse } from './AcademicAsignatureCourse';
import { ClassroomPlanExpectedPerformance } from './ClassroomPlanExpectedPerformance';
import { ClassroomPlanMethodologicalRoute } from './ClassroomPlanMethodologicalRoute';
import { ClassroomPlanPerformanceAppraisalStrategy } from './ClassroomPlanPerformanceAppraisalStrategy';

@Index("index_full_academicStandards", ["academicPeriodId", "academicAsignatureId", "academicGradeId", "academicAsignatureCourseId", "academicStandardsId", "campusId"])
@Index("index_full_learnings", ["academicPeriodId", "academicAsignatureId", "academicGradeId", "academicAsignatureCourseId", "learningsId", "campusId"])
@Index("index_full_generalBasicLearningRights", ["academicPeriodId", "academicAsignatureId", "academicGradeId", "academicAsignatureCourseId", "generalBasicLearningRightsId", "campusId"])
@ObjectType({ description: 'The ClassroomPlan model', implements: IModelCampusData })
@Entity()
export class ClassroomPlan extends IModelCampusData {

    @Field({ nullable: true })
    @Column({ nullable: true })
    startDate?: Date;

    @Field({ nullable: true })
    @Column({ nullable: true })
    endDate?: Date;

    @Index("index_academicPeriodId")
    @Field({ nullable: true })
    @Column({ nullable: true })
    academicPeriodId?: string;

    @Field({ nullable: true })
    academicPeriod?: AcademicPeriod;

    @Index("index_academicAsignatureId")
    @Field({ nullable: true })
    @Column({ nullable: true })
    academicAsignatureId?: string;

    @Field({ nullable: true })
    academicAsignature?: AcademicAsignature;

    @Index("index_academicGradeId")
    @Field({ nullable: true })
    @Column({ nullable: true })
    academicGradeId?: string;

    @Field({ nullable: true })
    academicGrade?: AcademicGrade;

    @Index("index_academicAsignatureCourseId")
    @Field({ nullable: true })
    @Column({ nullable: true })
    academicAsignatureCourseId?: string;

    @Field({ nullable: true })
    academicAsignatureCourse?: AcademicAsignatureCourse;

    @Index("index_learningsId")
    @Field(() => [String], { nullable: true })
    @Column({ nullable: true })
    learningsId?: String[];

    @Field(() => [Learning], { nullable: true })
    learnigs?: Learning[];

    @Index("index_academicStandardsId")
    @Field(() => [String], { nullable: true })
    @Column({ nullable: true })
    academicStandardsId?: String[];

    @Field(() => [AcademicStandard], { nullable: true })
    academicStandards?: AcademicStandard[];

    @Index("index_generalBasicLearningRightsId")
    @Field(() => [String], { nullable: true })
    @Column({ nullable: true })
    generalBasicLearningRightsId?: String[];

    @Field(() => [GeneralBasicLearningRight], { nullable: true })
    generalBasicLearningRights?: GeneralBasicLearningRight;

    @Field(() => [ClassroomPlanExpectedPerformance], { nullable: true })
    @Column({ nullable: true })
    classroomPlanExpectedPerformances?: ClassroomPlanExpectedPerformance[];

    @Field(() => [ClassroomPlanPerformanceAppraisalStrategy], { nullable: true })
    @Column({ nullable: true })
    classroomPlanPerformanceAppraisalStrategies?: ClassroomPlanPerformanceAppraisalStrategy[];

    @Field(() => [ClassroomPlanMethodologicalRoute], { nullable: true })
    @Column({ nullable: true })
    classroomPlanMethodologicalRoutes?: ClassroomPlanMethodologicalRoute[];
}

@ObjectType()
export class ClassroomPlanEdge extends EdgeType('ClassroomPlan', ClassroomPlan) { }

@ObjectType()
export class ClassroomPlanConnection extends ConnectionType<ClassroomPlanEdge>(
    'ClassroomPlan',
    ClassroomPlanEdge
) { }
