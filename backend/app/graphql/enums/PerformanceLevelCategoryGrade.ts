import { registerEnumType } from 'type-graphql';

export enum PerformanceLevelCategoryGrade {
    ALL = 'ALL',
    SPECIFIC = 'SPECIFIC',
}

registerEnumType(PerformanceLevelCategoryGrade, {
    name: 'PerformanceLevelCategoryGrade', // this one is mandatory
    description: 'The PerformanceLevelCategoryGrade Register', // this one is optional
});
