import { registerEnumType } from "type-graphql";

export enum QuestionTypeTestOnline {
    MULTIPLECHOICE = "MULTIPLECHOICE",
    TRUEFALSE = "TRUEFALSE",
    SHORTANSWER = "SHORTANSWER",
    NUMERICAL = "NUMERICAL",
    ESSAY = "ESSAY"
}

registerEnumType(QuestionTypeTestOnline, {
    name: "QuestionTypeTestOnline", // this one is mandatory
    description: "The QuestionTypeTestOnline Register", // this one is optional
});