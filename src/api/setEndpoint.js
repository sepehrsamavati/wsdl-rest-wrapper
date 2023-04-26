// @ts-check
/**
 * @param{any} app
 * @param{import("../interfaces/endpoint.interface").IEndpoint} endpoint
*/
export const setEndpoint = (app, endpoint) => {
    app.post(endpoint.path, (req, res, next) => {
        const response = { message: "Got your request" };
        res.json(response);
    });
};