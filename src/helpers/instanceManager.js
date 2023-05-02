// @ts-check

/**
 * @typedef {import("../types/instanceManager").Instance} Instance
*/
export class InstanceManager {
    /** @type {Instance[]} */
    #instances = [];

    /**
     * @param {import("express").Router} apiRouter
    */
    constructor(apiRouter) {
        this.apiRouter = apiRouter;
    }

    get count() {
        return this.#instances.length;
    }

    /**
     * @param {Instance} instance
     */
    add(instance) {
        this.#instances.push(instance);
    }

    /**
     * @param {string} name
    */
    nameExists(name) {
        return Boolean(this.#instances.find(i => i.name === name));
    }

    /**
     * @param {string} [name]
    */
    dispose(name) {
        const instance = name ? this.#instances.find(i => i.name === name) : null;
        if (instance) {
            const instanceIndex = this.#instances.indexOf(instance);
            if(instanceIndex !== -1)
            {
                const routerIndex = this.apiRouter.stack.findIndex(ee => ee.handle.name === "router" && ee.handle === instance.router);
                if (routerIndex !== -1) {
                    this.#instances.splice(instanceIndex, 1);
                    this.apiRouter.stack.splice(routerIndex, 1);
                    return true;
                }
            }
        }
        return false;
    }
}
