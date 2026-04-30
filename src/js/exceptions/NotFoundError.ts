import HttpError from "./HttpError.ts";
import {ErrorPayloadFromAPI} from "../my_types.ts";

export default class NotFoundError extends HttpError {

    constructor(details?: string, body: ErrorPayloadFromAPI | null = null) {
        super(404, details, body)
    }

}
