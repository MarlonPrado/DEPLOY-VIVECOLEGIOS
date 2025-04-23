import { registerEnumType } from "type-graphql";

export enum ExperienceRecoveryPlanType {
    TRADITIONALVALUATION = "TRADITIONALVALUATION",
    // ONLINETEST = "ONLINETEST"
}

registerEnumType(ExperienceRecoveryPlanType, {
    name: "ExperienceRecoveryPlanType", // this one is mandatory
    description: "The ExperienceRecoveryPlanType Register", // this one is optional
});