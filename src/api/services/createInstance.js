// @ts-check
import wsdlParser from "../../wsdl.js";
import { setupSwagger } from "../app.js";
import createRouter from "../createRouter.js";
import { setEndpoint } from "../setEndpoint.js";
import { logEndpoints } from "../getEndpoints.js";
import { createSwaggerJson } from "../../helpers/swaggerJson.js";
import { OperationResult } from "../../models/operationResult.js";
import { InstanceManager } from "../../helpers/instanceManager.js";

const validNameRegex = /^(?!\.)(?!com[0-9]$)(?!con$)(?!lpt[0-9]$)(?!nul$)(?!prn$)[^\|\*\?\\:<>/$"]*[^\.\|\*\?\\:<>/$"]+$/;

/**
 * @param {import("express").Router} apiRouter
 * @param {Partial<ICreateInstance>} data
 * @param {InstanceManager} instanceManager
*/
export default async (apiRouter, data, instanceManager) => {
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
        const baseApiPath = '/api' + basePath;
        const { soapClient, endpoints } = await wsdlParser(data.wsdlUrl);

        if(data.basicAuth)
            soapClient.addHttpHeader("Authorization", "Basic " + Buffer.from(`${data.basicAuth.username}:${data.basicAuth.password}`).toString("base64"));
    
        const instanceRouter = createRouter({
            parentRouter: apiRouter, path: basePath
        });

        const instanceSoapRouter = createRouter({
            parentRouter: instanceRouter, path: "/soap"
        });
    
        endpoints.forEach(ep => {
            setEndpoint(instanceSoapRouter, ep, soapClient);
        });
    
        const swaggerPath = "/swagger";
        setupSwagger(instanceRouter, baseApiPath, swaggerPath, createSwaggerJson(baseApiPath, endpoints));
        logEndpoints(instanceSoapRouter);

        instanceManager.add({ name: data.name, router: instanceRouter });
        operationResult.succeeded(baseApiPath + swaggerPath);
    } else {
        operationResult.failed("Instance info not provided");
    }
    return operationResult;
};
