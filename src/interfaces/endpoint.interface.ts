import { Namespace } from "wsdl-next";

type IEndpointParameter = Namespace["params"];

export interface IEndpoint {
    path: string;
    requestParams: IEndpointParameter;
    responseParams: IEndpointParameter;
}