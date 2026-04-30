import HttpError from "./HttpError.ts";
import {ErrorPayloadFromAPI} from "../my_types.ts";

export default class ShouldLogoutError extends HttpError  {
    constructor(statusCode: number, details?: string, body: ErrorPayloadFromAPI | null = null) {
        super(statusCode, details, body)
    }
}
