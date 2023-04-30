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
* @param{any[]} schemas
*/
export const createTypes = (schemas) => {
    /** @type{ (ElementType)[] } */
    const types = [];
    schemas.forEach(schema => {
        /** @type{ ElementType | null } */
        let model = null;

        if(schema.complexType) {
            propToArray(schema.complexType.sequence, "element");
            const props = createTypes(schema.complexType.sequence.element);
            model = createComplexType(schema.name, props);
        } else if(schema.simpleType) {
            model = createSimpleType(schema);
        }

        if(model)
            types.push(model);
    });
    return types;
};


/*
if (typeDetect.isXs(schema.type)) {
            model = createSimpleType(schema.value);
        } else if (typeDetect.isTns(schema.type)) {
            const typeName = namespaceHelper(schema.value.type);
            const referenceType = schemas.find(s => s.value.name === typeName && (s.type === "simple" || s.type === "complex" && s.schemaGroup === schema.schemaGroup));
            if (referenceType) {
                const typeKey = referenceType.type === "simple" ? "simpleType" : "complexType";
                delete schema.value.type;
                schema.value[typeKey] = referenceType.value;
                if (schema.value.complexType) {
                    propToArray(schema.value.complexType.sequence, "element");
                    const subSchemas = [];
                    const props = createTypes(schema.value.complexType.sequence.element);
                    model = createComplexType(schema.value.name, props);
                } else if (schema.value.simpleType) {
                    model = createSimpleType(schema.value);
                }
            }
        } else {
            debugger
        }
*/