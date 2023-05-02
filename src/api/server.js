// @ts-check
import { createServer, Server } from 'node:http';

export default class {
    /** @type {Server | null} */
    #server = null;
    #isLocked = false;

    /**
     * @param {import('express').Application} app
     * @param {number} port
     */
    constructor(app, port){
        this.app = app;
        this.port = port;
    }

    start(){
        if(this.#isLocked) return;
        this.#lock();

        const httpServer = this.#server = createServer(this.app);
    
        httpServer.listen(this.port, () => {
            console.log(`Express listening on http://127.0.0.1:${this.port}`);
            this.#unlock();
        });

        return httpServer;
    }

    restart(){
        const server = this.#server;
        if(server)
        {
            if(this.#isLocked) return;
            this.#lock();

            server.close((err) => {
                if(err) throw err;
                this.#unlock();
                this.start();
            });
        }
    }

    #lock(){
        this.#isLocked = true;
    }

    #unlock(){
        this.#isLocked = false;
    }
}
