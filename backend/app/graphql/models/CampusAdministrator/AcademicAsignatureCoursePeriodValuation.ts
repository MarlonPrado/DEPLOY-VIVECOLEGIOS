import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';
import { ValuationType } from '../../enums/ValuationType';
import { IModelCampusData } from '../../interfaces/IModelCampusData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { Student } from '../GeneralAdministrator/Student';
import { AcademicPeriod } from '../SchoolAdministrator/AcademicPeriod';
import { PerformanceLevel } from '../SchoolAdministrator/PerformanceLevel';
import { AcademicAsignatureCourse } from './AcademicAsignatureCourse';

@Index("index_full", ["academicAsignatureCourseId", "academicPeriodId", "studentId", "performanceLevelId", "campusId"])
@ObjectType({ description: 'The AcademicAsignatureCoursePeriodValuation model', implements: IModelCampusData })
@Entity()
export class AcademicAsignatureCoursePeriodValuation extends IModelCampusData {

    @Index("index_academicAsignatureCourseId")
    @Field({ nullable: true })
    @Column({ nullable: true })
    academicAsignatureCourseId?: string;

    @Field({ nullable: true })
    academicAsignatureCourse?: AcademicAsignatureCourse;

    @Index("index_academicPeriodId")
    @Field({ nullable: true })
    @Column({ nullable: true })
    academicPeriodId?: string;

    @Field({ nullable: true })
    academicPeriod?: AcademicPeriod;

    @Index("index_studentId")
    @Field({ nullable: true })
    @Column({ nullable: true })
    studentId?: String;

    @Field({ nullable: true })
    student?: Student;

    @Field({ nullable: true })
    @Column({ nullable: true })
    assessment?: number;

    @Index("index_performanceLevelId")
    @Field({ nullable: true })
    @Column({ nullable: true })
    performanceLevelId?: String;

    @Field(() => PerformanceLevel, { nullable: true })
    performanceLevel?: PerformanceLevel;

    @Field(() => ValuationType, { nullable: true })
    @Column({ nullable: true })
    valuationType?: ValuationType;
}

@ObjectType()
export class AcademicAsignatureCoursePeriodValuationEdge extends EdgeType('AcademicAsignatureCoursePeriodValuation', AcademicAsignatureCoursePeriodValuation) { }

@ObjectType()
export class AcademicAsignatureCoursePeriodValuationConnection extends ConnectionType<AcademicAsignatureCoursePeriodValuationEdge>(
    'AcademicAsignatureCoursePeriodValuation',
    AcademicAsignatureCoursePeriodValuationEdge
) { }
