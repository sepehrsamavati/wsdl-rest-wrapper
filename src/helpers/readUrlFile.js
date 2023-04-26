// @ts-check
import fs from "node:fs/promises";
export default async () => {
    const asString = (await fs.readFile("./url.txt")).toString("utf8");

    const firstUrl = asString.split('\n')
        // @ts-ignore
        .filter(url => URL.canParse(url))
        .shift();

    if(!firstUrl) {
        throw new Error("Invalid URL");
    }

    return firstUrl;
};