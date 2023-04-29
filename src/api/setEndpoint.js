// @ts-check

import { Client } from "soap";

/**
 * @param{import("express").Application} app
 * @param{import("../interfaces/endpoint.interface").IEndpoint} endpoint
 * @param{Client} soapClient
*/
export const setEndpoint = (app, endpoint, soapClient) => {
    app.post(endpoint.path, async (req, res, next) => {
        let soapRequestFunction;
        
        try {
            soapRequestFunction = soapClient[endpoint.service][endpoint.port][endpoint.method];
        } catch {
            next();
            return;
        }

        if(typeof soapRequestFunction === "function") {
            soapRequestFunction(req.body, (err, result) => {
                res.json(result ?? err);
            });
        } else {
            next();
        }
    });
};