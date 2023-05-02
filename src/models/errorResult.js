// @ts-check

import { appVersion } from "../helpers/packageJson.js";

/**
 * @implements IErrorResult
*/
export default class ErrorResult {
    httpCode = 0;
    message = "Unknown error";
    version = appVersion;
    date = new Date();

    /**
     * @param {ErrorResultInfo} errorInfo
    */
    constructor(errorInfo){
        if(errorInfo.httpCode)
            this.httpCode = errorInfo.httpCode;
        if(errorInfo.message)
            this.message = errorInfo.message;
        if(errorInfo.details)
            this.details = errorInfo.details;
    }
}
