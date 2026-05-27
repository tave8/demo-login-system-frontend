import {ErrorPayloadFromAPI} from "../my_types.ts";
import InvalidErrorInfoPayloadError from "./InvalidErrorInfoPayloadError.ts";

/**
 * ## Base class for HTTP responses whose status code is not ok
 * 
 * Use it when a non-ok status code
 * has not been been handled previously.
 * 
 * 
 * ## Example usage (after making sure that are no network problems):
 * 
 * ```js
 * 
 * if (!resp.ok) {
 *     // can optionally pass a details message
 *     throw new HttpError(resp.status)
 *  }
 * 
 * ```
 */
export default class HttpError extends Error {

  public body: ErrorPayloadFromAPI

  constructor(statusCode: number,
              body: ErrorPayloadFromAPI,
              details?: string)
  {

    // check that this body has the schema we expect,
    // before working with it
    // the server might not have sent us the payload schema we expect
    HttpError.requireValidBodyWhenNonOkResponse(body)

    const baseMessage = `Server response is not ok. Status code was '${statusCode}'.`
    const fullMessage = details ? `${baseMessage} DETAILS: ${details}` : baseMessage
    super(fullMessage)
    this.body = body

  }

  /**
   * If there are errors in the body, simply
   * join them to make a string.
   */
  public getErrorsAsStr(): string {
    if (this.body == null) {
      return "<no errors found in body>";
    }

    try {
      const parts: string[] = [];

      if (this.body.message != null) {
        parts.push(this.body.message);
      }

      if (this.body.errors != null && Object.keys(this.body.errors).length > 0) {
        const errors = Object.values(this.body.errors).flat().join(", ");
        parts.push(errors);
      }

      if (parts.length === 0) {
        return "<no errors found in body>";
      }

      return parts.join(". ");

    } catch (err) {
      return "<error parsing the body>";
    }
  }


  /**
   * In case of a non-ok response, we throw this exception,
   * but we're still not 100% sure that the server has sent
   * us the correct fields in the json payload.
   * So we check that.
   *
   * Check that the body exactly has these fields,
   *  and that these fields have the expected types.
   *  For example, there must be an array of strings etc.
   *
   * Expected JSON payload schema:
   * <pre>
   * {
   *     "errors":    string[]   // array of error messages, can be empty
   *     "message":   string     // human-readable error summary
   *     "timestamp": string     // ISO 8601 timestamp of when the error occurred (we just check if it's string)
   * }
   * </pre>
   *
   * Example:
   * <pre>
   * {
   *     "errors":    ["Email is not valid", "Password is too short"],
   *     "message":   "Validation failed",
   *     "timestamp": "2026-05-27T10:30:00Z"
   * }
   * </pre>
   */
  public static requireValidBodyWhenNonOkResponse(body: ErrorPayloadFromAPI): void {

    // body must be a non-null object
    if (body === null || typeof body !== "object" || Array.isArray(body)) {
      throw new InvalidErrorInfoPayloadError(
          "Error payload must be a non-null object. " +
          "Got: '" + (body === null ? "null" : typeof body) + "'. " +
          "Body was: " + JSON.stringify(body) + "."
      );
    }

    // body must have exactly these fields, no more, no less
    const expectedKeys = ["errors", "message", "timestamp"];
    const actualKeys = Object.keys(body);

    const missingKeys = expectedKeys.filter(k => !actualKeys.includes(k));
    const extraKeys = actualKeys.filter(k => !expectedKeys.includes(k));

    if (missingKeys.length > 0) {
      throw new InvalidErrorInfoPayloadError(
          "Error payload is missing required fields: " + JSON.stringify(missingKeys) + ". " +
          "Expected fields: " + JSON.stringify(expectedKeys) + ". " +
          "Actual fields: " + JSON.stringify(actualKeys) + ". " +
          "Body was: " + JSON.stringify(body) + "."
      );
    }

    if (extraKeys.length > 0) {
      throw new InvalidErrorInfoPayloadError(
          "Error payload contains unexpected fields: " + JSON.stringify(extraKeys) + ". " +
          "Expected fields: " + JSON.stringify(expectedKeys) + ". " +
          "Actual fields: " + JSON.stringify(actualKeys) + ". " +
          "Body was: " + JSON.stringify(body) + "."
      );
    }

    // errors must be an array of strings
    if (!Array.isArray(body.errors)) {
      throw new InvalidErrorInfoPayloadError(
          "'errors' field must be an array. " +
          "Got: '" + typeof body.errors + "'. " +
          "Body was: " + JSON.stringify(body) + "."
      );
    }

    const allStrings = body.errors.every(e => typeof e === "string");

    if (!allStrings) {
      throw new InvalidErrorInfoPayloadError(
          "'errors' field must be an array of strings. " +
          "Body was: " + JSON.stringify(body) + "."
      );
    }

    // message must be a string
    if (typeof body.message !== "string") {
      throw new InvalidErrorInfoPayloadError(
          "'message' field must be a string. " +
          "Got: '" + typeof body.message + "'. " +
          "Body was: " + JSON.stringify(body) + "."
      );
    }

    // timestamp must be a string
    if (typeof body.timestamp !== "string") {
      throw new InvalidErrorInfoPayloadError(
          "'timestamp' field must be a string. " +
          "Got: '" + typeof body.timestamp + "'. " +
          "Body was: " + JSON.stringify(body) + "."
      );
    }
  }


}
