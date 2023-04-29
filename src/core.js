// @ts-check
import wsdlParser from "./wsdl.js";
import { startServer } from "./api/server.js";
import readUrlFile from "./helpers/readUrlFile.js";
import { setEndpoint } from "./api/setEndpoint.js";
import { getEndpoints } from "./api/getEndPoints.js";
import { createSwaggerJson } from "./helpers/swaggerJson.js";
import { newExpressApp, setupSwagger, setupErrorHandlers } from "./api/app.js";

const { soapClient, endpoints } = await wsdlParser(await readUrlFile());

const app = newExpressApp();

endpoints.forEach(ep => setEndpoint(app, ep, soapClient));

console.log("\n\n" + getEndpoints(app).join('\n') + "\n\n");

setupSwagger(app, createSwaggerJson(endpoints));
setupErrorHandlers(app);
startServer(app);
