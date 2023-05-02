// @ts-check

/**
 * @param {import("express").Router} router
*/
export const getEndpoints = (router) => {
    /** @type {{method: string;path: string}[]} */
    const endpoints = [];
    const raw = router.stack.filter(r => r.route && r.route.path).map(r => r.route);
    raw.forEach(ep => {
        Object.entries(ep.methods).forEach(m => {
            if(m[1] == true)
                endpoints.push({
                    method: m[0].toUpperCase().trim(),
                    path: ep.path
                });
        });
    });
    return endpoints;
};

export const logEndPoints = (router) => {
    console.log("\n\n" + getEndpoints(router).map(ep => `${ep.method.padEnd(6)} ${ep.path}`).join('\n') + "\n\n");
};
