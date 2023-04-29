export const getEndpoints = (app) => {
    const endpoints = [];
    const raw = app._router.stack.filter(r => r.route && r.route.path).map(r => r.route);
    raw.forEach(ep => {
        Object.entries(ep.methods).forEach(m => {
            if(m[1] == true)
                endpoints.push(`${m[0].toUpperCase().trim().padEnd(6)} ${ep.path}`);
        });
    });
    return endpoints;
};