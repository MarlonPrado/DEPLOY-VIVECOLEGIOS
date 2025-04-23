import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';
import { IModelCampusData } from '../../interfaces/IModelCampusData';
import { ConnectionType, EdgeType } from '../../pagination/relaySpecs';
import { Student } from '../GeneralAdministrator/Student';
import { PerformanceLevel } from '../SchoolAdministrator/PerformanceLevel';
import { ExperienceLearningRubricCriteria } from './ExperienceLearningRubricCriteria';

@Index("index_full", ["experienceLearningRubricCriteriaId", "studentId", "performanceLevelId", "campusId"])
@ObjectType({
  description: 'The ExperienceLearningRubricCriteriaValuation model',
  implements: IModelCampusData,
})
@Entity()
export class ExperienceLearningRubricCriteriaValuation extends IModelCampusData {
  @Index("index_experienceLearningRubricCriteriaId")
  @Field({ nullable: true })
  @Column({ nullable: true })
  experienceLearningRubricCriteriaId?: string;

  @Field({ nullable: true })
  experienceLearningRubricCriteria?: ExperienceLearningRubricCriteria;

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
}

@ObjectType()
export class ExperienceLearningRubricCriteriaValuationEdge extends EdgeType(
  'ExperienceLearningRubricCriteriaValuation',
  ExperienceLearningRubricCriteriaValuation
) { }

@ObjectType()
export class ExperienceLearningRubricCriteriaValuationConnection extends ConnectionType<ExperienceLearningRubricCriteriaValuationEdge>(
  'ExperienceLearningRubricCriteriaValuation',
  ExperienceLearningRubricCriteriaValuationEdge
) { }
