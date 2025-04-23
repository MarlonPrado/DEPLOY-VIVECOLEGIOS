import { registerEnumType } from "type-graphql";

export enum Day {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}

registerEnumType(Day, {
    name: "Day", // this one is mandatory
    description: "The Day Register", // this one is optional
});