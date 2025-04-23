import { registerEnumType } from "type-graphql";

export enum ExperienceType {
    COEVALUATION = "COEVALUATION",
    SELFAPPRAISAL = "SELFAPPRAISAL",
    TRADITIONALVALUATION = "TRADITIONALVALUATION",
    VALUATIONRUBRIC = "VALUATIONRUBRIC"
    // ONLINETEST = "ONLINETEST"
}

registerEnumType(ExperienceType, {
    name: "ExperienceType", // this one is mandatory
    description: "The ExperienceType Register", // this one is optional
});