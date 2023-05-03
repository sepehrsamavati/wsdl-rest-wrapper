// @ts-check
import { isValid } from "../../helpers/accessTokens.js";

/**
 * @type {import("express").RequestHandler}
*/
export default (req, res, next) => {
    const token = req.headers["access-token"];
    if(!token) res.status(401).end();
    else if(isValid(token.toString())) next();
    else res.status(403).end();
};