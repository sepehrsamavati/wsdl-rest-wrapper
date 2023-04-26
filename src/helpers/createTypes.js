// @ts-check

/**
 * @typedef {import("../types/genericType.js").ElementType} ElementType
 * @typedef {import("../types/genericType.js").ComplexType} Complex
*/

import propToArray from "./propToArray.js";
import { SimpleType, ComplexType } from "../models/genericType.js";

const createSimpleType = (/** @type {any} */ el) => {
    const nullable = el.nillable == "true";
    return new SimpleType({
        name: el.name,
        type: el.type,
        required: false
    });
};

/**
 * @param {string} name
 * @param {ElementType[]} props
*/
const createComplexType = (name, props) => {
    /** @type{Complex} */
    const value = {};
    props.forEach(p => {
        value[p.name] = p;
    });
    return new ComplexType({
        name: name,
        value
    });
};

/**
* @param{any[]} schemaElement
*/
export const createTypes = (schemaElement) => {
    /** @type{ (ElementType)[] } */
    const types = [];
    schemaElement.forEach(el => {
        /** @type{ ElementType | null } */
        let model = null;

        if(el.complexType) {
            propToArray(el.complexType.sequence, "element");
            const props = createTypes(el.complexType.sequence.element);
            model = createComplexType(el.name, props);
        } else {
            model = createSimpleType(el);
        }

        if(model)
            types.push(model);
    });
    return types;
 };