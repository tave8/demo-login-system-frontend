import ShouldLogoutError from "./ShouldLogoutError.ts";
import {ErrorPayloadFromAPI} from "../my_types.ts";

export default class ForbiddenError extends ShouldLogoutError {
    constructor(body: ErrorPayloadFromAPI, details?: string) {
        super(403, body, details)
    }
}
