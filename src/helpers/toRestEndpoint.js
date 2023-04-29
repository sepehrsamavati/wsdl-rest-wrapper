// @ts-check

const namespaceHelper = (/** @type {string} */ text) => text?.split(':').pop();

/**
* @typedef {import("../interfaces/endpoint.interface").IEndpoint[]} IEndpoints
* @param{any} definitions
* @param{string[]} endpoints
* @param{import("./createTypes").ElementType[]} types
* @param{any} service
* @returns{IEndpoints}
*/
export const serviceToEndpoint = (definitions, endpoints, types, service) => {
    const { binding: bindings, portType: portTypes } = definitions;

    /** @type{IEndpoints} */
    const serviceEndpoints = [];
    const servicePortBindingName = namespaceHelper(service.port.binding);
    endpoints.forEach(ep => {
        const binding = bindings
                        .filter(b => b.name === servicePortBindingName)
                        .find(b => b.operation.name === ep);

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
                address: service.port.address.location,
                request: inputType,
                response: outputType
            });
        });
    });
    return serviceEndpoints;
};
