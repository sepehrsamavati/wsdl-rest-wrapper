// @ts-check

import { Router } from "express";

/**
 * @typedef {import("express").Application} ExpressApplication
 * @typedef {import("express").Router} ExpressRouter
 * @param {{path: string; parentApp?: ExpressApplication; parentRouter?: ExpressRouter;}} options
*/
export default (options) => {
    const router = Router();

    if(options.parentApp)
        options.parentApp.use(options.path, router);
    else if(options.parentRouter)
        options.parentRouter.use(options.path, router);

    return router;
};
