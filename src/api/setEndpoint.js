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
        } catch {
            next();
            return;
        }

        if(typeof soapRequestFunction === "function") {
            res.set("Connection", "close");
            try {
                soapRequestFunction(req.body, (err, result) => {
                    debugger
                    if(err) {
                        if(result.status && result.statusText) {
                            res.json(new ErrorResult({
                                httpCode: result.status,
                                message: result.statusText
                            }));
                        } else {
                            res.json(new ErrorResult({
                                message: "Unknown SOAP error occurred.",
                                details: err.Fault
                            }));
                        }
                    } else {
                        res.json(result);
                    }
                });
            } catch(e) {
                res.json(new ErrorResult({
                    message: `Unknown SOAP error occurred. ${e.message}`
                }));
            }
        } else {
            next();
        }
    });
};