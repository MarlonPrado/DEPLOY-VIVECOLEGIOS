import { Field, InputType } from 'type-graphql';
import { Day } from '../../enums/Day';
import { AcademicSchedule } from '../../models/CampusAdministrator/AcademicSchedule';

@InputType()
export class NewAcademicSchedule implements Partial<AcademicSchedule> {
    @Field({ nullable: true })
    campusId?: string;

    @Field({ nullable: true })
    academicAsignatureCourseId?: string;

    @Field({ nullable: true })
    courseId?: string;

    @Field({ nullable: true })
    teacherId?: string;

    @Field({ nullable: true })
    startAcademicHourId?: string;

    @Field({ nullable: true })
    endAcademicHourId?: string;

    @Field({ nullable: true })
    day?: Day;
}
