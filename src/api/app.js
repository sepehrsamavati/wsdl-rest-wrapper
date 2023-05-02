// @ts-check
import express from "express";
import * as events from 'node:events';
import swaggerUi from 'swagger-ui-express';
import createInstance from "./services/createInstance.js";
import { InstanceManager } from "../helpers/instanceManager.js";

/* Increase event listeners limit */
events.EventEmitter.prototype.setMaxListeners(1000);

export const newExpressApp = () => {
    const app = express();

    const instanceManager = new InstanceManager(app);

    app.use(express.json());

    app.get('/ip', (req, res) => res.send(req.socket.remoteAddress));

    app.post('/new', async (req, res) => {
        res.json(await createInstance(app, req.body, instanceManager));
    });

    app.delete('/delete', async (req, res) => {
        res.json(instanceManager.dispose(req.query?.name?.toString()));
    });

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
    const swaggerJsonPath = `${path}/swagger.json`;

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
    app.use((err, req, res, next) => {
        const errorCode = err.status || 500;
    
        res.status(errorCode).json({
            message: err.message ?? "Unknown",
            errorCode
        });
    });
};
