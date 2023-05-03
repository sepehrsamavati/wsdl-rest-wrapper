// @ts-check
import soap from "soap";
import { serviceToEndpoint } from "./helpers/toRestEndpoint.js";

/**
 * @param{string} url
 * @returns{Promise<import("./interfaces/wsdl.interface").IParsedWSDL>}
*/
export default async function wsdlParser(url) {

    const soapClient = await soap.createClientAsync(url);

    /** @type{import("./interfaces/wsdl.interface").IDescribedWSDL} */
    const describedServices = soapClient.describe();

    const endpoints = [];
    serviceToEndpoint(describedServices).forEach(ep => endpoints.push(ep));

    return {
        soapClient, endpoints
    };
};
