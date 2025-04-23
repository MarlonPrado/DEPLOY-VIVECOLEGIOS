import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';
import { QuestionTypeTestOnline } from '../../enums/QuestionTypeTestOnline';
import { IModelCampusData } from '../../interfaces/IModelCampusData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { QuestionCategoryTestOnline } from './QuestionCategoryTestOnline';

@Index("index_full", ["questionCategoryTestOnlineId", "campusId"])
@ObjectType({ description: 'The QuestionTestOnline model', implements: IModelCampusData })
@Entity()
export class QuestionTestOnline extends IModelCampusData {
    @Index("index_questionCategoryTestOnlineId")
    @Field({ nullable: true })
    @Column({ nullable: true })
    questionCategoryTestOnlineId?: string;

    @Field({ nullable: true })
    questionCategoryTestOnline?: QuestionCategoryTestOnline;

    @Field(() => QuestionTypeTestOnline, { nullable: true })
    @Column({ nullable: true })
    questionType?: QuestionTypeTestOnline;

    @Field({ nullable: true })
    @Column({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    statement?: string;
}

@ObjectType()
export class QuestionTestOnlineEdge extends EdgeType('QuestionTestOnline', QuestionTestOnline) { }

@ObjectType()
export class QuestionTestOnlineConnection extends ConnectionType<QuestionTestOnlineEdge>('QuestionTestOnline', QuestionTestOnlineEdge) { }
