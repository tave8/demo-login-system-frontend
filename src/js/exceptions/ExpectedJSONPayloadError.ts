
export default class ExpectedJSONPayloadError extends Error {
    constructor(details?: string) {
        super(`A JSON payload was expected, but none was found. DETAILS: ${details}`)
    }
}
