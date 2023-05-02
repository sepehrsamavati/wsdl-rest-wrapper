// @ts-check

import wsdlParser from "../../wsdl.js";
import { setupSwagger } from "../app.js";
import createRouter from "../createRouter.js";
import { setEndpoint } from "../setEndpoint.js";
import { logEndPoints } from "../getEndpoints.js";
import { createSwaggerJson } from "../../helpers/swaggerJson.js";
import { OperationResult } from "../../models/operationResult.js";
import { InstanceManager } from "../../helpers/instanceManager.js";

const validNameRegex = /^(?!\.)(?!com[0-9]$)(?!con$)(?!lpt[0-9]$)(?!nul$)(?!prn$)[^\|\*\?\\:<>/$"]*[^\.\|\*\?\\:<>/$"]+$/;

/**
 * @param {import("express").Application} app
 * @param {Partial<ICreateInstance>} data
 * @param {InstanceManager} instanceManager
*/
export default async (app, data, instanceManager) => {
    const operationResult = new OperationResult();
    if(data) {
        if(!(data.wsdlUrl
            // @ts-ignore
            && URL.canParse(data.wsdlUrl)))
            return operationResult.failed("Invalid WSDL URL");
        if(!(data.name && typeof data.name === "string")) return operationResult.failed("Name not provided");

        data.name = data.name.trim();

        if(!validNameRegex.test(data.name)) return operationResult.failed("Invalid name");
        if(instanceManager.nameExists(data.name)) return operationResult.failed("Name already in use");

        /* Data valid */
        const basePath = '/' + data.name;
        const { soapClient, endpoints } = await wsdlParser(data.wsdlUrl);

        if(data.basicAuth)
            soapClient.addHttpHeader("Authorization", "Basic " + Buffer.from(`${data.basicAuth.username}:${data.basicAuth.password}`).toString("base64"));
    
        const router = createRouter(app, basePath);
    
        endpoints.forEach(ep => {
            setEndpoint(router, ep, soapClient);
        });
    
        setupSwagger(app, basePath, createSwaggerJson(basePath, endpoints));
        logEndPoints(router);

        instanceManager.add({ name: data.name, router });
        operationResult.succeeded();
    } else {
        operationResult.failed("Instance info not provided");
    }
    return operationResult;
};
