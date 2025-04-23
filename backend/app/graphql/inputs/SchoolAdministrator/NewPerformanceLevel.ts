import { Field, InputType } from 'type-graphql';

import { PerformanceLevelCategory } from '../../enums/PerformanceLevelCategory';
import { PerformanceLevelCategoryGrade } from '../../enums/PerformanceLevelCategoryGrade';
import { PerformanceLevelType } from '../../enums/PerformanceLevelType';
import { PerformanceLevel } from '../../models/SchoolAdministrator/PerformanceLevel';

@InputType()
export class NewPerformanceLevel implements Partial<PerformanceLevel> {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  minimumScore?: number;

  @Field({ nullable: true })
  topScore?: number;

  @Field({ nullable: true })
  abbreviation?: string;

  @Field({ nullable: true })
  colorHex?: string;

  @Field({ nullable: true })
  isFinal?: boolean;

  @Field({ nullable: true })
  isRecovery?: boolean;

  @Field(() => PerformanceLevelType, { nullable: true })
  type?: PerformanceLevelType;

  @Field({ nullable: true })
  generalPerformanceLevelId?: string;

  @Field(() => PerformanceLevelCategory, { nullable: true })
  category?: PerformanceLevelCategory;

  @Field(() => PerformanceLevelCategoryGrade, { nullable: true })
  categoryGrade?: PerformanceLevelCategoryGrade;

  @Field(() => [String], { nullable: true })
  academicGradesId?: String[];

  @Field(() => [String], { nullable: true })
  campusId?: String[];

  @Field({ nullable: true })
  schoolId?: string;

  @Field({ nullable: true })
  order?: number;

  @Field({ nullable: true })
  schoolYearId?: string;

}
