// @ts-check

const namespaceHelper = (/** @type {string} */ text) => text?.split(':').pop();

/**
* @param{any} definitions
* @param{string[]} endpoints
* @param{import("./createTypes").ElementType[]} types
* @param{any} service
* @returns{import("../interfaces/endpoint.interface").IEndpoint[]}
*/
export const serviceToEndpoint = (definitions, endpoints, types, service) => {
    const { binding: bindings, portType: portTypes } = definitions;

    const serviceEndpoints = [];
    const servicePortBindingName = namespaceHelper(service.port.binding);
    endpoints.forEach(ep => {
        const binding = bindings
                        .filter(b => b.name === servicePortBindingName)
                        .find(b => b.operation.name === ep);

        if(!binding) return;

        const bindingName = namespaceHelper(binding.type);
        const portType = portTypes.find(pt => pt.name === bindingName);

        portType.operation.forEach(o => {
            const inputMessageName = namespaceHelper(o.input.message);
            const outputMessageName = namespaceHelper(o.output.message);

            const inputMessage = definitions.message.find(m => m.name === inputMessageName);
            const inputMessageTypeName = namespaceHelper(inputMessage?.part.find(p => p.name === "parameters")?.element);

            const outputMessage = definitions.message.find(m => m.name === outputMessageName);
            const outputMessageTypeName = namespaceHelper(outputMessage?.part.find(p => p.name === "parameters")?.element);

            const inputType = types.find(t => t.name === inputMessageTypeName);
            const outputType = types.find(t => t.name === outputMessageTypeName);

            serviceEndpoints.push({
                name: service.name,
                path: `/${service.name}/${o.name}`,
                address: service.port.address.location,
                request: inputType,
                response: outputType
            });
        });
    });
    return serviceEndpoints;
};
