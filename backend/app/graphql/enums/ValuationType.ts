import { registerEnumType } from "type-graphql";

export enum ValuationType {
    DEFINITIVE = "DEFINITIVE",
    CALCULATE = "CALCULATE",
    RECOVERY = "RECOVERY"
}

registerEnumType(ValuationType, {
    name: "ValuationType", // this one is mandatory
    description: "The ValuationType Register", // this one is optional
});