// @ts-check
import express from "express";
import { EventEmitter } from 'node:events';
import swaggerUi from 'swagger-ui-express';
import createRouter from "./createRouter.js";
import apiConfigJson from "../helpers/apiConfigJson.js";
import createInstance from "./services/createInstance.js";
import accessControl from "./middlewares/accessControl.js";
import { InstanceManager } from "../helpers/instanceManager.js";

/* Increase event listeners limit */
EventEmitter.prototype.setMaxListeners(1000);

export const newExpressApp = () => {
    const app = express();

    const apiRouter = createRouter({
        path: apiConfigJson.runtimeRouter,
        parentApp: app
    });
    const instanceManager = new InstanceManager(apiRouter);

    app.use(express.json());

    app.get('/ip', (req, res) => res.send(req.socket.remoteAddress));

    app.post('/new', accessControl, async (req, res) => {
        res.json(await createInstance(apiRouter, req.body, instanceManager));
    });

    app.delete('/delete', accessControl, async (req, res) => {
        res.json(instanceManager.dispose(req.query?.name?.toString()));
    });

    app.use(apiConfigJson.runtimeRouter, apiRouter);

    return app;
};

/**
 * @typedef {import("express").Application} ExpressApplication
 * @typedef {import("express").Router} Router
 * @param {Router} router
 * @param {string} basePath
 * @param {string} path
 * @param {any} swaggerData
*/
export const setupSwagger = (router, basePath, path, swaggerData) => {
    const swaggerJsonPath = path + apiConfigJson.swaggerJson;

    const options = {
        swaggerOptions: {
            url: basePath + swaggerJsonPath,
        },
    };

    router.get(swaggerJsonPath, (req, res) => {
        res.json(swaggerData);
    });
    router.use(path, swaggerUi.serveFiles(undefined, options), swaggerUi.setup(undefined, options));
};

/**
 * @param {ExpressApplication} app
*/
export const setupErrorHandlers = (app) => {
    app.use((req, res, next) => {
        const errorCode = 404;
        res.status(errorCode).json({
            message: "not found",
            errorCode
        });
    });

    app.use((err, req, res, next) => {
        const errorCode = err.status || 500;
    
        res.status(errorCode).json({
            message: err.message ?? "Unknown",
            errorCode
        });
    });
};
