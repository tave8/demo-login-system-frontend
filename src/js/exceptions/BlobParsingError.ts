export default class BlobParsingError extends Error {
    constructor(msg: string) {
        super(`Error while parsing a blob. DETAILS: ${msg}`);
    }
}