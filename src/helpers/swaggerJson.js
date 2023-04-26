// @ts-check

import propToArray from "./propToArray.js";
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
            "description": "",
            "version": "1.0"
        },
        "produces": ["application/json"],
        "paths": {
            /*
            "/test": {
                "post": {
                    "operationId": "index",
                    "tags": ["/test"],
                    "description": "[Login 123](https://www.google.com)",
                    "parameters": [{
                        "name": "test",
                        "in": "formData",
                        "type": "array",
                        "collectionFormat": "multi",
                        "items": {
                            "type": "integer"
                        }
                    },
                    { "name": "profileId", "in": "formData", "required": true, "type": "string" },
                    { "name": "file", "in": "formData", "type": "file", "required": "true" }],
                    "responses": {}
                }
            }*/
        }
    };
    endpoints.forEach(ep => {
        data.paths[ep.path] = {
            post: {
                parameters: ep.request instanceof SimpleType ? portSimple(ep.request) : portComplex(ep.request),
                responses: ep.response instanceof SimpleType ? portSimple(ep.response) : portComplex(ep.response)
            }
        };
    });
    return data;
};