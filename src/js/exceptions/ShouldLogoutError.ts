import HttpError from "./HttpError.ts";
import {ErrorPayloadFromAPI} from "../my_types.ts";

export default class ShouldLogoutError extends HttpError  {
    constructor(statusCode: number, body: ErrorPayloadFromAPI, details?: string) {
        super(statusCode, body, details)
    }
}
