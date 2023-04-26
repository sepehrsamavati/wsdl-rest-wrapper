// @ts-check
/**
 * @param{any} app
 * @param{import("../interfaces/endpoint.interface").IEndpoint} endpoint
*/
export const setEndpoint = (app, endpoint) => {
    app.post(endpoint.path, (req, res, next) => {
        if(!Array.isArray(endpoint.responseParams))
            endpoint.responseParams = [endpoint.responseParams];

        const response = {};

        endpoint.responseParams.forEach(p => {
            let value = null;
            switch(p.type){
                case "string":
                    value = Math.random().toString(32).split('.').pop();
                    break;
                case "number":
                    value = Math.round(Math.random() * 8000) + 1000;
                    break;
                case "boolean":
                    value = Math.random() > 0.5;
                    break;
            }
            response[p.name] = value;
        });

        res.json(response);
    });
};