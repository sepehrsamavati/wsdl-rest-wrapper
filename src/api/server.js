import { createServer } from 'node:http';

export const startServer = (app) => {
    const httpServer = createServer(app);

    const port = 8503;

    httpServer.listen(port, function () {
        console.log(`Express listening on http://127.0.0.1:${port}`);
    });
};
