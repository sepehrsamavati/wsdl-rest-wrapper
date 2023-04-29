// @ts-check
import express from "express";
import * as events from 'node:events';
import swaggerUi from 'swagger-ui-express';

/* Increase event listeners limit */
events.EventEmitter.prototype.setMaxListeners(1000);

export const newExpressApp = () => {
    const app = express();

    app.use(express.urlencoded({ extended: true }));

    app.get('/ip', (req, res) => res.send(req.socket.remoteAddress));

    return app;
};

/**
 * @typedef {import("express").Application} ExpressApplication
 * @param {ExpressApplication} app
*/
export const setupSwagger = (app, swaggerData) => {
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerData));
};

/**
 * @param {ExpressApplication} app
*/
export const setupErrorHandlers = (app) => {
    app.use((req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
    
    app.use((err, req, res, next) => {
        const errorCode = err.status || 500;
    
        res.status(errorCode).json({
            message: err.message ?? "Unkown",
            errorCode
        });
    });
};
