// @ts-check
import Server from "./api/server.js";
import { logEndpoints } from "./api/getEndpoints.js";
import { initHotLoad } from "./helpers/accessTokens.js";
import { newExpressApp, setupErrorHandlers } from "./api/app.js";

const app = newExpressApp();

logEndpoints(app._router);

setupErrorHandlers(app);

initHotLoad();

const server = new Server(app, 8503);
server.start();
