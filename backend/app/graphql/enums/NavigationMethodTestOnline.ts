import { registerEnumType } from "type-graphql";

export enum NavigationMethodTestOnline {
    FREE = "FREE",
    SEQUENTIAL = "SEQUENTIAL",
}

registerEnumType(NavigationMethodTestOnline, {
    name: "NavigationMethodTestOnline", // this one is mandatory
    description: "The NavigationMethodTestOnline Register", // this one is optional
});