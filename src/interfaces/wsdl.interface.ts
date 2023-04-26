import { IEndpoint } from "./endpoint.interface";
import { Client } from "soap";

export interface IParsedWSDL {
    soapClient: Client;
    name: string;
    targetNamespace: string;
    endpoints: IEndpoint[];
}