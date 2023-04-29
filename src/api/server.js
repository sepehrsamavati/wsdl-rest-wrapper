// @ts-check
import { createServer } from 'node:http';

/**
 * 
 * @param {import('express').Application} app 
 */
export const startServer = (app) => {
    const httpServer = createServer(app);

    const port = 8503;

    httpServer.listen(port, function () {
        console.log(`Express listening on http://127.0.0.1:${port}`);
    });
};
