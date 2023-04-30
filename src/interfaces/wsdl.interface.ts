import { Client } from "soap";
import { IEndpoint } from "./endpoint.interface";

export interface IParsedWSDL {
    soapClient: Client;
    endpoints: IEndpoint[];
}

export interface IDescribedWSDL {
    [service: string]: {
        [port: string]: {
            [method: string]: {
                input?: {
                    [name: string]: WSDLParam;
                }
                output?: {
                    [name: string]: WSDLParam;
                }
            }
        }
    }
}

export interface ISchema {
    schemaGroup: number;
    type: "simple" | "complex" | "element";
    value: any;
}
