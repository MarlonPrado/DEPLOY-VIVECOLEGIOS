import { registerEnumType } from 'type-graphql';

export enum PerformanceLevelCategory {
  SCHOOL = 'SCHOOL',
  CAMPUS = 'CAMPUS',
}

registerEnumType(PerformanceLevelCategory, {
  name: 'PerformanceLevelCategory', // this one is mandatory
  description: 'The PerformanceLevelCategory Register', // this one is optional
});
