import { SimpleType as ST, ComplexType as CT } from "../models/genericType.js";

export type SimpleType = string | number | boolean | undefined;
export type ElementType = ST | CT;

export type ComplexType = {
    [key: string]: ElementType;
};

export type SimpleTypeProperties = {
    name: string;
    type: string;
    required: boolean;
};

export type ComplexTypeProperties = {
    name: string;
    value: ComplexType;
};
