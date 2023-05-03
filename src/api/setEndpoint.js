// @ts-check

import { Client } from "soap";
import ErrorResult from "../models/errorResult.js";

/**
 * @param{import("express").Router} router
 * @param{import("../interfaces/endpoint.interface").IEndpoint} endpoint
 * @param{Client} soapClient
*/
export const setEndpoint = (router, endpoint, soapClient) => {
    router.post(endpoint.path, async (req, res, next) => {
        let soapRequestFunction;
        
        try {
            soapRequestFunction = soapClient[endpoint.service][endpoint.port][endpoint.method];
        } catch(e) {
            res.status(510).json(new ErrorResult({
                message: "SOAP service not found"
            }));
            return;
        }

        if(typeof soapRequestFunction === "function") {
            res.set("Connection", "close");
            try {
                soapRequestFunction(req.body, (err, result) => {
                    if(err) {
                        if(result?.status && result.statusText) {
                            res.status(503).json(new ErrorResult({
                                httpCode: err.Fault?.faultcode ?? err.Fault?.statusCode ?? result.status,
                                message: err.Fault?.detail ?? result.statusText,
                                details: err.Fault
                            }));
                        } else {
                            let errorDeepClone = undefined, errorCode = 0;
                            try {
                                errorDeepClone = JSON.parse(JSON.stringify(err));
                            } catch {}
                            
                            if(err.code === "ETIMEDOUT") errorCode = 408;

                            res.status(503).json(new ErrorResult({
                                httpCode: errorCode,
                                message: err.message ?? "Unknown SOAP error occurred.",
                                details: err.Fault ?? errorDeepClone
                            }));
                        }
                    } else {
                        res.status(200).json(result);
                    }
                });
            } catch(e) {
                res.status(503).json(new ErrorResult({
                    message: `Unknown SOAP error occurred. ${e.message}`
                }));
            }
        } else {
            res.status(510).json(new ErrorResult({
                message: "SOAP service not found"
            }));
        }
    });
};
