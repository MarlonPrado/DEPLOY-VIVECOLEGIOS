import { registerEnumType } from "type-graphql";

export enum PerformanceLevelType {
    QUALITATIVE = "QUALITATIVE",
    QUANTITATIVE = "QUANTITATIVE",
}

registerEnumType(PerformanceLevelType, {
    name: "PerformanceLevelType", // this one is mandatory
    description: "The PerformanceLevelType Register", // this one is optional
});