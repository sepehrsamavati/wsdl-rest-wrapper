// @ts-check
import { getFileContent, watchFile } from "./fileReader.js";

/** @type {string[]} */
let tokens = [];

/** @param {string} token */
export const isValid = token => tokens.includes(token);

export const initHotLoad = () => {
    const path = "./configuration/.tokens";
    watchFile(path, async () => {
        try {
            const rawText = (await getFileContent(path)).toString();
            tokens = rawText.split("\n").map(line => line.split('#')[0].trim()).filter(token => token.length > 0);
        } catch(e) {
            console.error(e);
        }
    });
};
