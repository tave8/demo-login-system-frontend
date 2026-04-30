import { isLoggedIn } from "../auth/isLoggedIn"
import BadRequestError from "./exceptions/BadRequestError"
import HttpError from "./exceptions/HttpError"
import InvalidFileUploadedError from "./exceptions/InvalidFileUploadedError"
import NetworkError from "./exceptions/NetworkError"
import ServerError from "./exceptions/ServerError"
import UnauthorizedError from "./exceptions/UnauthorizedError"
import FileHelper from "./FileHelper"
import {ErrorPayloadFromAPI, FetchConfigType, RequestHeaderContentType, RequestMethod} from "./my_types"
import ForbiddenError from "./exceptions/ForbiddenError.ts";
import NotFoundError from "./exceptions/NotFoundError.ts";
import ExpectedJSONPayloadError from "./exceptions/ExpectedJSONPayloadError.ts";
// import {logout} from "../auth/AuthContext.tsx"

let API_URL: string

try {
  // @ts-ignore
  API_URL = import.meta.env.VITE_API_URL
} catch (err) {
  throw new Error("error loading env var 'VITE_API_URL'; are you sure it exists?")
}

/**
 * API helper.
 */
export default class APIHelper {
  // static logout: () => void = logout

  /**
   *
   * @returns the URL of the API server
   */
  static getAPIUrl(): string {
    return API_URL
  }

  /**
   * Get the API url plus whatever endpoint.
   * Example of return value:
   * https://api.giuseppetavella.com/my/custom/endpoint
   */
  public static getAPIUrlAt(endpoint: string = ""): string {
    const trimmed = endpoint.trim()

    // if root endpoint
    if (trimmed === "") {
      return APIHelper.getAPIUrl()
    }

    // if endpoint does not start with /
    if (!trimmed.startsWith("/")) {
      throw new Error(`Endpoint must start with '/'. Got: '${endpoint}'`)
    }

    // endpoint cannot contain consecutive backslashes
    if (trimmed.includes("//")) {
      throw new Error(`Endpoint must not contain consecutive slashes. Got: '${endpoint}'`)
    }

    // Let the URL parser decide if it's valid
    try {
      new URL(trimmed, APIHelper.getAPIUrl())
    } catch {
      throw new Error(`Malformed endpoint: '${endpoint}'`)
    }

    return APIHelper.getAPIUrl() + trimmed
  }

  /**
   *
   * @returns value of the Authorization header,
   *  thus a string prefixed with "Bearer " + access token
   */
  public static getAuthorizationHeaderValue(): string {
    return "Bearer " + APIHelper.getAccessToken()
  }

  /**
   * Get local access token,
   * which is supposed to contain
   * the necessary info used by the server
   * to authenticate the user, so at the very at least,
   * the user ID.
   */
  public static getAccessToken(): string {
    const accessToken: string | null = localStorage.getItem("token")
    // access token missing
    if (!accessToken) {
      throw new Error(
        `while trying to get access token from local storage, ` +
          `it was assumed that access token was there, but it's not. ` +
          `got value '${accessToken}' instead. ` +
          `are you sure you needed the access token for this operation ` +
          `(and therefore authentication), and you assumed it was there?`,
      )
    }
    // if the user is not logged in, or for some reason,
    // the access token could be malformed or have been tampered with
    // at the frontend side, or it's expired
    if (!isLoggedIn()) {
      throw new Error(
        "while getting access token from local storage, the user" +
          "does not seem to be logged in. this may be due to the access token " +
          "being expired or having been tampered with. the user can try to log back in again" +
          "and check whether that solves the problem",
      )
    }
    return accessToken
  }

  /**
   * Parse a JSON from a response.
   * Require that a response body is in JSON.
   * That means, it is required that the server
   * sends a valid JSON body in its response, else
   * this function will throw an error.
   *
   * @throws {ExpectedJSONPayloadError} if no JSON body is found or no relevant content-type indicating a JSON body
   */
  public static async parseJSON<T_FROM_API>(resp: Response): Promise<T_FROM_API> {

    // the url the request was made to
    const url: string = resp.url
    const isNoContentStatusCode = resp.status == 204
    const contentTypeHeader: string | null = resp.headers.get("content-type")

    // if the status code is 204, then there's no response body and
    // no content-type header (for example with a successful DELETE request)
    if (isNoContentStatusCode) {
      // the "null as unknown as T_FROM_API" trick is simply to
      // trick typescript into not checking the type (by first casting null to unknown)
      // and then casting unknown to T_FROM_API type
      return Promise.resolve(null as unknown as T_FROM_API)
    }

    // if the content-type is not even there
    if (!contentTypeHeader) {
      throw new ExpectedJSONPayloadError(
        `Before parsing JSON from a response, the Content-type header from the response was not even there, ` +
          `therefore it is not possible to determine if this response contains JSON. URL was: ${url}`,
      )
    }

    const hasSentJSON = contentTypeHeader.includes("application/json")
    // if the content-type is different from application/json,
    // this will definitely not be a valid JSON
    if (!hasSentJSON) {
      throw new ExpectedJSONPayloadError(
        `Before parsing JSON from a response, the Content-type header from the response ` +
          `was not 'application/json', therefore it is not possible to parse the response body into JSON. ` +
          `Content-type header value is '${contentTypeHeader}' instead. URL was: ${url}`,
      )
    }

    try {

      // try to parse the response body
      const data: T_FROM_API = await resp.json()

      return data

    } catch (err) {
      throw new ExpectedJSONPayloadError(
        `After parsing JSON from a response body, it was assumed ` +
          `that this would be valid JSON, however the parsing into JSON failed. URL was: ${url}. Details of error: ` +
          err,
      )
    }

  }

  /**
   * Is the API server ok?
   */
  static async APIServerIsOk(): Promise<Boolean> {
    const url = APIHelper.getAPIUrl()

    try {

      await fetch(url)

      return true

    } catch (err) {
      return false
    }

  }

  /**
   * ## Get a `fetch` configuration object for JSON-based requests
   *
   * Get a `fetch` configuration object to
   * pass directly to the `fetch` function,
   * based on request method (GET, POST etc.).
   * Avoids having to pass fetch config manually.
   *
   * @param method The request method (GET, POST etc.)
   * @param requireLogin Whether you require the user to be authenticated/logged in.
   *  This will add an Authorization: Bearer xyz header to the request
   * @param body A valid, plain JS object
   */
  public static getFetchConfigFor(method: RequestMethod): RequestInit
  public static getFetchConfigFor(method: RequestMethod, requireLogin: boolean): RequestInit
  public static getFetchConfigFor(method: RequestMethod, requireLogin: boolean, body: object): RequestInit
  public static getFetchConfigFor(method: RequestMethod, requireLogin: boolean = false, body: object | null = null): RequestInit {
    // does this request method require a JSON body?
    const methodRequiresJSONBody: boolean = APIHelper.requestMethodRequiresJSONBody(method)
    // does this request method NOT require a JSON body?
    const methodNotRequiresJSONBody: boolean = APIHelper.requestMethodNotRequiresJSONBody(method)

    // is this a valid, plain JS object?
    const isBodyAPlainObject = APIHelper.isPlainObject(body)
    const isNullBody = body == null

    // ****************************
    // CHECKS
    // ****************************

    // if the method is not GET or DELETE, then it must have a body
    // and the body must be a valid javascript object
    if (methodRequiresJSONBody) {
      if (!isBodyAPlainObject) {
        throw new Error(
          `The given method '${method}' requires a request body, ` +
            `which should be passed as a valid, plain JS object, ` +
            `however an invalid object was given, or the object is not a plain JS object. ` +
            `Input object was of type '${typeof body}' with value '${body}'`,
        )
      }
    }

    // if the method is GET or DELETE, it certainly cannot have a body,
    // whatever that body is and regardless whether that's a valid object or not
    if (methodNotRequiresJSONBody) {
      if (!isNullBody) {
        throw new Error(`The given method '${method}' does NOT require a body, ` + `therefore it does not make sense to pass an object to be the request body.`)
      }
    }

    // ************************
    // BUILD THE CUSTOM FETCH CONFIG
    // ************************

    const config: FetchConfigType = {
      method: method,
      headers: {},
    }

    if (methodRequiresJSONBody) {
      config.headers["content-type"] = RequestHeaderContentType.APPLICATION_JSON
      // try to parse the given body (a valid, plain JS object)
      // into a JSON string
      // no error should occur, however we try/catch it nonetheless
      try {
        const bodyAsJSONStr = JSON.stringify(body)
        config.body = bodyAsJSONStr
      } catch (err) {
        throw new Error(
          `While building the fetch config for a method, ` +
            `an error was thrown by built-in method 'JSON.stringify' while parsing ` +
            `what seemed to be a valid and plain JS object. Maybe this object to parsed into a JSON string, ` +
            `was not a valid JS object? Or maybe the internal validation steps were not accurate enough? ` +
            `Input object to be parsed into a JSON string was: ${body}`,
        )
      }
    }

    // if authentication/login is required
    if (requireLogin) {
      config.headers.authorization = APIHelper.getAuthorizationHeaderValue()
    }

    // *********************
    // ADAPT TO BUILT-IN REQUEST INIT
    // *********************

    const headers: HeadersInit = {
      ...config.headers,
    }

    let requestInit: RequestInit = {
      method,
      headers,
      body: methodRequiresJSONBody ? config.body : null,
    }

    return requestInit
  }

  /**
   * ## Get a `fetch` configuration object for a request to send a file
   *
   * Get a `fetch` configuration object to
   * pass directly to the `fetch` function,
   * based on request method (POST, PATCH, PUT).
   * Avoids having to pass fetch config manually.
   *
   * @param method The request method (GET, POST etc.)
   * @param file a File object
   * @param field the field name at which the server expects this file, for example "avatar_image"
   * @param requireLogin Whether you require the user to be authenticated/logged in.
   *  This will add an Authorization: Bearer xyz header to the request
   * 
   * @throws {InvalidFileUploadedError} if the file is empty
   */
  public static getFetchConfigForFile(method: RequestMethod, file: File, field: string, requireLogin: boolean): RequestInit {
    // if request method is not allowed to send a file
    if (!APIHelper.isRequestMethodAllowedToSendFile(method)) {
      throw new Error(`The given request method '${method}' is not allowed to send a file.`)
    }

    // if the file is empty
    if (FileHelper.isEmpty(file)) {
      throw new InvalidFileUploadedError(`While getting the fetch config for sending a file, ` + `the file is empty/null, therefore it does not make sense to send it.`)
    }

    // if the field name is nully
    if (!field) {
      throw new Error(`The field name for a file, of a request whose Content-type will be ` + `multipart/form-data (sending a file), cannot be empty/nully.`)
    }

    // all good, now we can create the config object

    const config: FetchConfigType = {
      method: method,
      headers: {},
    }

    // if authentication/login is required
    if (requireLogin) {
      config.headers.authorization = APIHelper.getAuthorizationHeaderValue()
    }

    // *********************
    // ADAPT TO BUILT-IN REQUEST INIT
    // *********************

    const headers: HeadersInit = {
      ...config.headers,
    }

    const formData = new FormData()

    // the field where the server will find the uploaded file
    formData.append(field, file)

    let requestInit: RequestInit = {
      method,
      headers,
      // setting the a FormData instance as the body, 
      // will make the browser (or fetch?) set the right
      // content-type request header, including multipart/form-data
      // and the form data boundary. for this reason, we should not
      // set the content-type header manually
      body: formData,
    }

    return requestInit
  }

  /**
   * Do a fetch request to a (relative) endpoint,
   * providing a fetch configuration object.
   *
   * A relative endpoint is simply the relative URL,
   * starting from the root domain.
   *
   * Example of relative URL = endpoint:
   *
   *    /auth/login
   *    /users/me
   *
   */
  public static async doFetchAt(relativeURLPath: string, config: RequestInit): Promise<Response> {
    const absoluteURL = APIHelper.getAPIUrlAt(relativeURLPath)
    return APIHelper.doFetch(absoluteURL, config)
  }

  /**
   * ## Do a fetch request to a complete/absolute URL with a fetch config object
   *
   *
   * ## Catch custom HTTP exceptions
   *
   * Custom exceptions can be caught in the .catch() promise method.
   *
   * For example, if the server returns an "unauthorized" status code,
   * a custom UnauthorizedError is thrown. This allows handling cases like:
   * - wrong credentials on signup/login
   * - user is no longer logged in
   *
   * @example
   * articlesAPI.getMyArticles()
   *   .catch((err) => {
   *     if (err instanceof UnauthorizedError) {
   *       // logout user or show wrong credentials message
   *     } else {
   *       // show generic error
   *     }
   *   })
   *
   * ## Params & throws
   *
   * @param absoluteURL absolute URL, example: https://mydomain.com/my/endpoint?q=abc
   * @param config a valid fetch configuration object (containing method, headers, etc.)
   *
   * @throws {NetworkError} if a fatal error occurs during the fetch
   * @throws {HttpError} if response status code is non-ok and no custom exception has been thrown before it
   * @throws {UnauthorizedError} if response status code is 401 - likely because of expired access token
   *    or similar non-authenticated/non-authorized scenarios
   * @throws {BadRequestError} if response status code is 400
   * @throws {ServerError} if response status code is 500
   */
  public static async doFetch(absoluteURL: string, config: RequestInit): Promise<Response> {
    let resp: Response

    // ***************************+
    // NETWORK PROBLEM?
    // ***************************+

    try {

      resp = await fetch(absoluteURL, config)

    } catch (err) {
      throw new NetworkError(err instanceof Error ? err.message : String(err))
    }


    // parse json body, if exists

    let jsonPayload: ErrorPayloadFromAPI | null = null;

    try {

      // trying to parse a json body, if exists
      jsonPayload = await APIHelper.parseJSON<ErrorPayloadFromAPI>(resp)

    } catch(err) {
      if(err instanceof ExpectedJSONPayloadError) {
        // we don't need to do anything
      }
    }


    // ***************************
    // SPECIFIC NON-OK RESPONSE?
    // ***************************

    const isBadRequest = resp.status == 400
    const isUnauthorized = resp.status == 401
    const isForbidden = resp.status == 403
    const isNotFound = resp.status == 404
    const isServerError = resp.status == 500

    if (isBadRequest) {
      throw new BadRequestError(resp.statusText, jsonPayload)
    }

    if (isUnauthorized) {
      throw new UnauthorizedError(resp.statusText, jsonPayload)
    }

    if (isForbidden) {
      throw new ForbiddenError(resp.statusText, jsonPayload)
    }

    if (isNotFound) {
      throw new NotFoundError(resp.statusText, jsonPayload)
    }

    if (isServerError) {
      throw new ServerError(resp.statusText, jsonPayload)
    }

    // ***************************
    // GENERIC NON-OK RESPONSE?
    // ***************************

    // generic error in request or response
    // if the response status code, or anything else about the response,
    // should throw a custom exception, it should be done before this moment
    if (!resp.ok) {
      throw new HttpError(resp.status, resp.statusText, jsonPayload)
    }

    return resp
  }

  /**
   * Is the given value a plain JS object?
   * Literally something like {x: 2}
   *
   * Therefore we cannot have objects that are instantiated
   * from a custom class. For example we cannot have something like
   * new MyClass()
   */
  public static isPlainObject(value: unknown): boolean {
    if (value == null || value == undefined) {
      return false
    }
    return Object.getPrototypeOf(value) === Object.prototype
  }

  /**
   * Does the given request method (GET, POST etc)
   * requires a JSON body?
   *
   * Methods allowed to have a JSON body: POST, PUT, PATCH
   */
  public static requestMethodRequiresJSONBody(method: RequestMethod): boolean {
    if (method == null || method == undefined) {
      throw new Error(`A fetch method cannot be nully. ` + `Make sure the caller is passing an actual RequestMethod enum type.`)
    }
    return method == RequestMethod.POST || method == RequestMethod.PUT || method == RequestMethod.PATCH
  }

  /**
   * Is the request method allowed to send a file?
   *
   * Methods allowed: POST, PUT, PATCH
   */
  public static isRequestMethodAllowedToSendFile(method: RequestMethod): boolean {
    if (method == null || method == undefined) {
      throw new Error(`A fetch method cannot be nully. ` + `Make sure the caller is passing an actual RequestMethod enum type.`)
    }
    return method == RequestMethod.POST || method == RequestMethod.PUT || method == RequestMethod.PATCH
  }

  /**
   * Does the given request method (GET, POST etc)
   * NOT require a JSON body?
   *
   * Methods NOT allowed to have a JSON body: GET, DELETE
   */
  public static requestMethodNotRequiresJSONBody(method: RequestMethod): boolean {
    if (method == null || method == undefined) {
      throw new Error(`A fetch method cannot be nully. ` + `Make sure the caller is passing an actual RequestMethod enum type.`)
    }
    return method == RequestMethod.GET || method == RequestMethod.DELETE
  }
}
