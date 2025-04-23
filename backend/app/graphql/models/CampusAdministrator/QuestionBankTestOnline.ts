import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';
import { IModelCampusData } from '../../interfaces/IModelCampusData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { AcademicAsignature } from '../SchoolAdministrator/AcademicAsignature';
import { AcademicGrade } from '../SchoolAdministrator/AcademicGrade';
import { Teacher } from './Teacher';

@Index("index_full", ["academicAsignatureId", "academicGradeId", "teacherId", "campusId"])
@ObjectType({ description: 'The QuestionBankTestOnline model', implements: IModelCampusData })
@Entity()
export class QuestionBankTestOnline extends IModelCampusData {
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

    @Index("index_teacherId")
    @Field({ nullable: true })
    @Column({ nullable: true })
    teacherId?: string;

    @Field({ nullable: true })
    teacher?: Teacher;
}

@ObjectType()
export class QuestionBankTestOnlineEdge extends EdgeType('QuestionBankTestOnline', QuestionBankTestOnline) { }

@ObjectType()
export class QuestionBankTestOnlineConnection extends ConnectionType<QuestionBankTestOnlineEdge>('QuestionBankTestOnline', QuestionBankTestOnlineEdge) { }
