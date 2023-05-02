// @ts-check
import Server from "./api/server.js";
import { logEndPoints } from "./api/getEndPoints.js";
import { newExpressApp, setupErrorHandlers } from "./api/app.js";

const app = newExpressApp();

logEndPoints(app._router);

setupErrorHandlers(app);

const server = new Server(app, 8503);
server.start();
