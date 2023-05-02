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
                                httpCode: result.status,
                                message: result.statusText
                            }));
                        } else {
                            res.status(503).json(new ErrorResult({
                                message: "Unknown SOAP error occurred.",
                                details: err.Fault
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
