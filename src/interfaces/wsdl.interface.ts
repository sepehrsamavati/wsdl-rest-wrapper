import { IEndpoint } from "./endpoint.interface";

export interface IParsedWSDL {
    name: string;
    targetNamespace: string;
    endpoints: IEndpoint[];
}