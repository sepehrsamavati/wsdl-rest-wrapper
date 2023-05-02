// @ts-check

import { appVersion, appDescription } from "./packageJson.js";
import { SimpleType, ComplexType } from "../models/genericType.js";

/**
 * @param {SimpleType} element
*/
const portSimpleParameter = (element) => {
    return {
        name: element.props.name,
        type: element.type,
        in: "formData",
        required: element.props.required
    };
};

/**
 * @param {ComplexType} element
*/
const portComplexParameter = (element) => {
    const properties = {};
    for(const [key, value] of Object.entries(element.props.value))
    {
        if(value instanceof SimpleType)
            properties[value.name] = {
                type: "string"
            };
        else
            properties[key] = portComplexParameter(value);
    }
    return {
        type: 'object',
        properties
    };
};

/**
 * @param {string} basePath
 * @param {import("../interfaces/endpoint.interface").IEndpoint[]} endpoints
*/
export const createSwaggerJson = (basePath, endpoints) => {
    const data = {
        "openapi": "3.0.0",
        "info": {
            "title": "Node WSDL to REST",
            "description": appDescription,
            "version": appVersion
        },
        "produces": ["application/json"],
        "paths": {}
    };
    endpoints.forEach(ep => {
        data.paths[basePath + "/soap" + ep.path] = {
            post: {
                tags: [`${ep.service} / ${ep.port}`],
                requestBody: ep.request ? (ep.request instanceof SimpleType ? portSimpleParameter(ep.request) : {
                    content: {
                        "application/json": {
                            in: 'body',
                            name: ep.request.name,
                            schema: portComplexParameter(ep.request)
                        }
                    }
                }) : undefined,
                responses: {
                    200: {
                        description: "✅ SOAP response OK"
                    },
                    404: {
                        description: "⚠ Operation not found in XML"
                    },
                    500: {
                        description: "❌ REST API server error"
                    }
                }
            }
        };
    });
    return data;
};
