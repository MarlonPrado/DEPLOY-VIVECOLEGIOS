import { registerEnumType } from 'type-graphql';

export enum EvaluativeComponentType {
  GENERAL = 'GENERAL',
  AREA = 'AREA',
  ASIGNATURE = 'ASIGNATURE',
}

registerEnumType(EvaluativeComponentType, {
  name: 'EvaluativeComponentType', // this one is mandatory
  description: 'The EvaluativeComponentType Register', // this one is optional
});
