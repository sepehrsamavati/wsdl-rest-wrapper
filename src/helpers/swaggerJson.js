// @ts-check

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
        if (!Array.isArray(ep.requestParams))
            ep.requestParams = [ep.requestParams];
        if (!Array.isArray(ep.responseParams))
            ep.responseParams = [ep.responseParams];
        data.paths[ep.path] = {
            post: {
                "parameters": ep.requestParams.map(epRp => {
                    return {
                        name: epRp.name,
                        type: epRp.type,
                        in: "formData",
                        required: true
                    };
                }),
                "responses": {}
            }
        };
    });
    return data;
};