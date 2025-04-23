import { registerEnumType } from "type-graphql";

export enum ExperienceLearningType {
    NORMAL = "NORMAL",
    RECOVERY = "RECOVERY"
}

registerEnumType(ExperienceLearningType, {
    name: "ExperienceLearningType", // this one is mandatory
    description: "The ExperienceLearningType Register", // this one is optional
});