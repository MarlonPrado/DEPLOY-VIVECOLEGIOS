import { Field, InputType } from 'type-graphql';
import { ClassroomPlan } from '../../models/CampusAdministrator/ClassroomPlan';
import { NewClassroomPlanExpectedPerformance } from './NewClassroomPlanExpectedPerformance';
import { NewClassroomPlanMethodologicalRoute } from './NewClassroomPlanMethodologicalRoute';
import { NewClassroomPlanPerformanceAppraisalStrategy } from './NewClassroomPlanPerformanceAppraisalStrategy';

@InputType()
export class NewClassroomPlan implements Partial<ClassroomPlan> {
    @Field({ nullable: true })
    campusId?: string;

    @Field({ nullable: true })
    startDate?: Date;

    @Field({ nullable: true })
    endDate?: Date;

    @Field({ nullable: true })
    academicPeriodId?: string;

    @Field({ nullable: true })
    academicAsignatureId?: string;

    @Field({ nullable: true })
    academicGradeId?: string;

    @Field({ nullable: true })
    academicAsignatureCourseId?: string;

    @Field(() => [String], { nullable: true })
    learningsId?: String[];

    @Field(() => [String], { nullable: true })
    academicStandardsId?: String[];

    @Field(() => [String], { nullable: true })
    generalBasicLearningRightsId?: String[];

    @Field(() => [NewClassroomPlanExpectedPerformance], { nullable: true })
    classroomPlanExpectedPerformances?: NewClassroomPlanExpectedPerformance[];

    @Field(() => [NewClassroomPlanPerformanceAppraisalStrategy], { nullable: true })
    classroomPlanPerformanceAppraisalStrategies?: NewClassroomPlanPerformanceAppraisalStrategy[];

    @Field(() => [NewClassroomPlanMethodologicalRoute], { nullable: true })
    classroomPlanMethodologicalRoutes?: NewClassroomPlanMethodologicalRoute[];
}
