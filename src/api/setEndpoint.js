// @ts-check

import { Client } from "soap";

/**
 * @param{any} app
 * @param{import("../interfaces/endpoint.interface").IEndpoint} endpoint
 * @param{Client} soapClient
*/
export const setEndpoint = (app, endpoint, soapClient) => {
    app.post(endpoint.path, async (req, res, next) => {
        const soapResponse = await soapClient[`${endpoint.path.split('/').pop()}Async`](req.body);
        res.json(soapResponse[0]);
    });
};