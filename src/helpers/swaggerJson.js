// @ts-check

import { appVersion, appDescription } from "./packageJson.js";
import { SimpleType, ComplexType } from "../models/genericType.js";

const portSimple = (/** @type {SimpleType} */ element) => {
    return {
        name: element.props.name,
        type: element.type,
        in: "formData",
        required: element.props.required
    };
};

const portComplex = (/** @type {ComplexType} */ element) => {
    const fields = [];
    for(const [key, value] of Object.entries(element.props.value))
    {
        if(value instanceof SimpleType)
            fields.push(portSimple(value));
        else
            fields.push(portComplex(value));
    }
    return fields;
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
                tags: [ep.service],
                parameters: ep.request instanceof SimpleType ? portSimple(ep.request) : portComplex(ep.request),
                responses: ep.response instanceof SimpleType ? portSimple(ep.response) : portComplex(ep.response)
            }
        };
    });
    return data;
};