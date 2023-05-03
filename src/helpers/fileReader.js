// @ts-check
import fs from "node:fs";

/** @param {string} path */
export const getFileContent = path => fs.promises.readFile(path);

/**
 * @param {string} path
 * @param {Function} callback
*/
export const watchFile = (path, callback) => {
    fs.watchFile(path, {
        bigint: false,
        persistent: false,
        interval: 5000
    }, () => {
        callback();
    }).unref();
};
