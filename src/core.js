// @ts-check
import Server from "./api/server.js";
import { logEndpoints } from "./api/getEndpoints.js";
import { newExpressApp, setupErrorHandlers } from "./api/app.js";
import { initHotLoad, readTokens } from "./helpers/accessTokens.js";

const app = newExpressApp();

logEndpoints(app._router);

setupErrorHandlers(app);

initHotLoad();
readTokens();

const server = new Server(app, 8503);
server.start();
