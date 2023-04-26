// @ts-check
import { WsdlNext } from "wsdl-next";
import { createTypes } from "./helpers/createTypes.js";
import propToArray from "./helpers/propToArray.js";

/**
 * @param{string} schemaUrl
*/
export const importSchema = async (schemaUrl) => {
    const xmlAsJson = WsdlNext.getXmlDataAsJson(await (await fetch(schemaUrl)).text());
    propToArray(xmlAsJson.schema, "element");
    return xmlAsJson.schema.element;
};

/**
* @param{any} service
* @returns{import("./interfaces/endpoint.interface").IEndpoint}
*/
export const serviceToEndpoint = (service) => {
    return {
        path: '/',
        requestParams: {},
        responseParams: {}
    };
};

/**
 * @param{string} url
 * @returns{Promise<import("./interfaces/wsdl.interface").IParsedWSDL>}
*/
export default async function wsdlParser(url) {
    const wsdl = await WsdlNext.create(url);

    const endpointsPath = await wsdl.getAllMethods();

    const endpoints = [];

    for(const path of endpointsPath) {
        const params = await wsdl.getMethodParamsByName(path);
        const requestParams = params.request.find(p => p.name === "parameters")?.params;
        const responseParams = params.response.find(p => p.name === "parameters")?.params;
        if(requestParams && responseParams)
            endpoints.push({
                path: `/${path}`,
                requestParams, responseParams
            });
    }

    const xmlAsJson = WsdlNext.getXmlDataAsJson(await (await fetch(url)).text());

    propToArray(xmlAsJson.definitions, "service");

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
    debugger

    return {
        name, targetNamespace,
        endpoints: service.map(serviceToEndpoint)
    };
};

