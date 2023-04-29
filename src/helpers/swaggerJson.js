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
    const parameters = [];
    for(const [key, value] of Object.entries(element.props.value))
    {
        if(value instanceof SimpleType)
            parameters.push(portSimpleParameter(value));
        else
            parameters.push(portComplexParameter(value));
    }
    return parameters;
};

export const createSwaggerJson = (/** @type{import("../interfaces/endpoint.interface").IEndpoint[]} */ endpoints) => {
    const data = {
        "swagger": "2.0",
        "info": {
            "title": "Node WSDL to REST",
            "description": appDescription,
            "version": appVersion
        },
        "produces": ["application/json"],
        "paths": {}
    };
    endpoints.forEach(ep => {
        data.paths[ep.path] = {
            post: {
                tags: [`${ep.service} / ${ep.port}`],
                parameters: ep.request instanceof SimpleType ? portSimpleParameter(ep.request) : portComplexParameter(ep.request),
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
