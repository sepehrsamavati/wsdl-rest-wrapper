// @ts-check

import { ComplexType, SimpleType } from "../models/genericType.js";

const namespaceHelper = (/** @type {string} */ text) => text?.split(':').pop();

/**
* @typedef {import("../interfaces/endpoint.interface").IEndpoint[]} IEndpoints
* @param{any} definitions
* @param{import("./createTypes").ElementType[]} types
* @param{any} service
* @returns{IEndpoints}
*/
export const serviceToEndpointLegacy = (definitions, types, service) => {
    const { binding: bindings, portType: portTypes } = definitions;

    /** @type{IEndpoints} */
    const serviceEndpoints = [];
    service.port.forEach(port => {
        const servicePortBindingName = namespaceHelper(port.binding);
        if(!servicePortBindingName) return;

        const binding = bindings
                        .find(b => b.name === servicePortBindingName);

        if(!binding) return;

        const bindingPortName = namespaceHelper(binding.type);
        if(!bindingPortName) return;
        const portType = portTypes.find(pt => pt.name === bindingPortName);

        portType.operation.forEach(method => {
            const inputMessageName = namespaceHelper(method.input.message);
            const outputMessageName = namespaceHelper(method.output.message);

            const inputMessage = definitions.message.find(m => m.name === inputMessageName);
            const inputMessageTypeName = namespaceHelper(inputMessage?.part.find(p => p.name === "parameters")?.element);

            const outputMessage = definitions.message.find(m => m.name === outputMessageName);
            const outputMessageTypeName = namespaceHelper(outputMessage?.part.find(p => p.name === "parameters")?.element);

            const inputType = types.find(t => t.name === inputMessageTypeName);
            const outputType = types.find(t => t.name === outputMessageTypeName);

            if(!(inputType && outputType)) return;

            serviceEndpoints.push({
                service: service.name,
                port: binding.name,
                method: method.name,
                path: `/${service.name}/${binding.name}/${method.name}`,
                // address: port.address.location,
                request: inputType,
                response: outputType
            });
        });
    });
    return serviceEndpoints;
};

/**
* @param{import("../interfaces/wsdl.interface").IDescribedWSDL} describedServices
* @returns{IEndpoints}
*/
export const serviceToEndpoint = (describedServices) => {
    /** @type {import("../types/genericType.js").ElementType[]} */
    const createdTypes = [];
    const propToType = (name, prop) => {
        if(typeof prop === "string") {
            if(prop.startsWith('xs')) {
                return new SimpleType({
                    name, required: false,
                    type: prop.split(':').pop() ?? "ERROR"
                });
            }
        }
        if(typeof prop === "object") {
            const propDictionary = Object.entries(prop);
            /** @type{import("../types/genericType.js").ComplexType} */
            const value = {};
            propDictionary.forEach(([propName, prop]) => {
                // Using cache to prevent recursive calls and infinite loop
                const fromCache = createdTypes.find(ct => ct.name === propName);
                let type;
                if(fromCache)
                    type = fromCache;
                else
                {
                    type = propToType(propName, prop);
                    if(type) {
                        createdTypes.push(type);
                    }
                }
                if(type)
                    value[propName] = type;
            });
            return new ComplexType({
                name,
                value
            });
        }
    };

    /** @type{IEndpoints} */
    const serviceEndpoints = [];

    Object.entries(describedServices)
        .forEach(([serviceName, service]) => {
            Object.entries(service)
                .forEach(([portName, port]) => {
                    Object.entries(port)
                        .forEach(([operationName, operation]) => {
                            let inputType;

                            if(operation.input) {
                                inputType = propToType(operationName, operation.input);
                            }

                            serviceEndpoints.push({
                                service: serviceName,
                                port: portName,
                                method: operationName,
                                path: `/${serviceName}/${portName}/${operationName}`,
                                request: inputType
                            });
                        });
                });
        });

    return serviceEndpoints;
};
