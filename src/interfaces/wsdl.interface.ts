import { IEndpoint } from "./endpoint.interface";
import { Client } from "soap";

export interface IParsedWSDL {
    soapClient: Client;
    name: string;
    targetNamespace: string;
    endpoints: IEndpoint[];
}

export interface IDescribedWSDL {
    [service: string]: {
        [port: string]: {
            [method: string]: {
                input: {
                    name: string;
                }
            }
        }
    }
}
