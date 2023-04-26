import { ElementType } from "../types/genericType.js";

type IEndpointParameter = ElementType;

export interface IEndpoint {
    name: string;
    path: string;
    address: string;
    request: IEndpointParameter;
    response: IEndpointParameter;
}