import HttpError from "./HttpError.ts";
import {ErrorPayloadFromAPI} from "../my_types.ts";

export default class NotFoundError extends HttpError {

    constructor(body: ErrorPayloadFromAPI, details?: string) {
        super(404, body, details)
    }

}
