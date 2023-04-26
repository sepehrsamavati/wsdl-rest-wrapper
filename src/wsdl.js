// @ts-check
import soap from "soap";
import { WsdlNext } from "wsdl-next";
import propToArray from "./helpers/propToArray.js";
import { createTypes } from "./helpers/createTypes.js";
import { serviceToEndpoint } from "./helpers/toRestEndpoint.js";

/**
 * @param{string} schemaUrl
*/
export const importSchema = async (schemaUrl) => {
    const xmlAsJson = WsdlNext.getXmlDataAsJson(await (await fetch(schemaUrl)).text());
    propToArray(xmlAsJson.schema, "element");
    return xmlAsJson.schema.element;
};

/**
 * @param{string} url
 * @returns{Promise<import("./interfaces/wsdl.interface").IParsedWSDL>}
*/
export default async function wsdlParser(url) {
    const wsdl = await WsdlNext.create(url);

    const endpointsPath = await wsdl.getAllMethods();

    //const endpoints = [];

    const xmlAsJson = WsdlNext.getXmlDataAsJson(await (await fetch(url)).text());

    propToArray(xmlAsJson.definitions, "service");
    propToArray(xmlAsJson.definitions, "binding");
    propToArray(xmlAsJson.definitions, "portType");
    propToArray(xmlAsJson.definitions, "message");

    xmlAsJson.definitions.portType.forEach(pt => propToArray(pt, "operation"));
    xmlAsJson.definitions.message.forEach(msg => propToArray(msg, "part"));

    const { name, targetNamespace, types, service } = xmlAsJson.definitions;

    if(types.schema)
    {
        propToArray(types.schema, "element", true);

        if(types.schema.import) {
            propToArray(types.schema, "import");
            for(const item of types.schema.import) {
                (await importSchema(item.schemaLocation)).forEach(schemaElement => {
                    types.schema.element.push(schemaElement);
                });
            }
        }
    }

    const runtimeTypes = createTypes(types.schema.element);

    // const soapClient = await soap.createClientAsync(url);

    const endpoints = [];
    service.forEach(service => {
        serviceToEndpoint(xmlAsJson.definitions, endpointsPath, runtimeTypes, service).forEach(ep => endpoints.push(ep));
    });
    debugger

    return {
        name, targetNamespace, endpoints
    };
};
