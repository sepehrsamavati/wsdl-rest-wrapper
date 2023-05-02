// @ts-check

/**
 * @typedef {import("../types/instanceManager").Instance} Instance
*/
export class InstanceManager {
    /** @type {Instance[]} */
    #instances = [];

    /**
     * @param {import("express").Application} app
    */
    constructor(app) {
        this.app = app;
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
            const index = this.app._router.stack.findIndex(ee => ee.handle.name === "router" && ee.handle === instance.router);
            if (index !== -1) {
                this.app._router.stack.splice(index, 1);
                return true;
            }
        }
        return false;
    }
}
