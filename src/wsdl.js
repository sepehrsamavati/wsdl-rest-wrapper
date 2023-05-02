// @ts-check
import soap from "soap";
import { WsdlNext } from "wsdl-next";
import propToArray from "./helpers/propToArray.js";
import { createTypes } from "./helpers/createTypes.js";
import { serviceToEndpoint } from "./helpers/toRestEndpoint.js";

/**
 * @typedef {import("./interfaces/wsdl.interface").ISchema[]} ISchemaList
*/

export const importSchema = async (/** @type {string} schemaUrl */ schemaUrl) => {
    const xmlAsJson = WsdlNext.getXmlDataAsJson(await (await fetch(schemaUrl)).text());
    schemaPropsToArray(xmlAsJson.schema);
    return xmlAsJson.schema;
};

export const namespaceHelper = (/** @type {string} */ text) => text?.split(':').pop();

const schemaPropsToArray = (/** @type {any} */ schema) => {
    propToArray(schema, "element");
    propToArray(schema, "simpleType");
    propToArray(schema, "complexType");
};

/**
 * @param {any} schema
 * @param {number} index
*/
const getSchemaItems = (schema, index) => {
    /** @type {ISchemaList} */
    const items = [];
    schema.simpleType?.forEach(t => {
        items.push({
            schemaGroup: index,
            type: "simple",
            value: t
        });
    });
    schema.complexType?.forEach(t => {
        items.push({
            schemaGroup: index,
            type: "complex",
            value: t
        });
    });
    schema.element?.forEach(e => {
        items.push({
            schemaGroup: index,
            type: "element",
            value: e
        });
    });
    return items;
};

/**
 * @param{string} url
 * @returns{Promise<import("./interfaces/wsdl.interface").IParsedWSDL>}
*/
export default async function wsdlParser(url) {
    /*const xmlAsJson = WsdlNext.getXmlDataAsJson(await (await fetch(url)).text());

    // Convert any to any[] (if isn't already an array)
    propToArray(xmlAsJson.definitions, "service");
    propToArray(xmlAsJson.definitions, "binding");
    propToArray(xmlAsJson.definitions, "portType");
    propToArray(xmlAsJson.definitions, "message");
    propToArray(xmlAsJson.definitions.types, "schema");

    xmlAsJson.definitions.service.forEach(s => propToArray(s, "port"));
    xmlAsJson.definitions.portType.forEach(pt => propToArray(pt, "operation"));
    xmlAsJson.definitions.message.forEach(msg => propToArray(msg, "part"));

    const { name, targetNamespace, types, service } = xmlAsJson.definitions;

     @type {ISchemaList} 
    const schemas = [];

    let schemaIndex = 0;
    for(const schema of types.schema)
    {
        schemaIndex++;
        schemaPropsToArray(schema);
        propToArray(schema, "import", true);

        // Import schema
        for(const item of schema.import.filter(i => i.schemaLocation)) {
            const importedSchema = await importSchema(item.schemaLocation);
            getSchemaItems(importedSchema, schemaIndex)?.forEach(item => schemas.push(item));
        }

        getSchemaItems(schema, schemaIndex)?.forEach(item => schemas.push(item));
    }
    */

    /* @type{import("./types/genericType.js").ElementType[]} 
    const runtimeTypes = createTypes();*/

    const soapClient = await soap.createClientAsync(url);
    /** @type{import("./interfaces/wsdl.interface").IDescribedWSDL} */
    const describedServices = soapClient.describe();

    const endpoints = [];
    serviceToEndpoint(describedServices).forEach(ep => endpoints.push(ep));

    return {
        soapClient, endpoints
    };
};
