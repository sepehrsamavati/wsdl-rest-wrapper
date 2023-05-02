// @ts-check
import Server from "./api/server.js";
import { logEndpoints } from "./api/getEndpoints.js";
import { newExpressApp, setupErrorHandlers } from "./api/app.js";

const app = newExpressApp();

logEndpoints(app._router);

setupErrorHandlers(app);

const server = new Server(app, 8503);
server.start();
