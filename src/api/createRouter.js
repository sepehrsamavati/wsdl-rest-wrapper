// @ts-check

import { Router } from "express";

/**
 * @param {import("./app").ExpressApplication} app
 * @param {string} path
*/
export default (app, path) => {
    const router = Router();

    app.use(path, router);

    return router;
};
