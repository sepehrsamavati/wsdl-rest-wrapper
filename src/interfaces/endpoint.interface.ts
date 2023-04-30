import { ElementType } from "../types/genericType.js";

type IEndpointParameter = ElementType;

export interface IEndpoint {
    service: string;
    port: string;
    method: string;
    path: string;
    request?: IEndpointParameter;
    response?: IEndpointParameter;
}