
/**
 * Use this class when the HTTP response is non-ok,
 * AND the server has not sent the promised payload
 * with the error info, such as errors in a list of strings,
 * the message as a string etc.
 */
export default class InvalidErrorInfoPayloadError extends Error {
    constructor(msg: string) {
        super(msg)
    }
}
