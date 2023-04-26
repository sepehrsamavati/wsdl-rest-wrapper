import { SimpleType as ST, ComplexType as CT } from "../models/genericType.js";

export type TypeNameSimple = "string" | "number" | "boolean";
export type TypeNameComplex = "complex";

export type SimpleType = string | number | boolean | undefined;

export type ComplexType = {
    [key: string]: ST | CT;
};

export type SimpleTypeProperties = {
    value: SimpleType;
    restriction: {
        required: boolean;
    };
};

export type ComplexTypeProperties = {
    value: ComplexType;
};
