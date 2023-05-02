// @ts-check
import wsdlParser from "./wsdl.js";
import { startServer } from "./api/server.js";
import createRouter from "./api/createRouter.js";
import readUrlFile from "./helpers/readUrlFile.js";
import { setEndpoint } from "./api/setEndpoint.js";
import { getEndpoints } from "./api/getEndPoints.js";
import { createSwaggerJson } from "./helpers/swaggerJson.js";
import { newExpressApp, setupSwagger, setupErrorHandlers } from "./api/app.js";

const app = newExpressApp();

// START of instance
const { soapClient, endpoints } = await wsdlParser(await readUrlFile());

const basePath = "/runtime";
const router = createRouter(app, basePath);

endpoints.forEach(ep => {
    setEndpoint(router, ep, soapClient);
});

setupSwagger(app, basePath, createSwaggerJson(basePath, endpoints));
// END of instance

console.log("\n\n" + getEndpoints(router).join('\n') + "\n\n");

console.log("\n\n" + getEndpoints(app._router).join('\n') + "\n\n");

setupErrorHandlers(app);
startServer(app);
