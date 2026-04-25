import { isLoggedIn } from "../auth/isLoggedIn"
import { FetchConfigType, RequestHeaderContentType, RequestMethod } from "./my_types"

let API_URL: string

try {
  API_URL = import.meta.env.VITE_API_URL
} catch (err) {
  throw new Error("error loading env var 'VITE_API_URL'; are you sure it exists?")
}

/**
 * API helper.
 */
export default class APIHelper {
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

    // the second character must not be another slash,
    // only if the endpoint length is > 0 (so at least 2 chars)
    if (trimmed.length > 0 && trimmed) {
      if (trimmed.charAt(1) == "/") {
        throw new Error(
          "Invalid endpoint. If it starts with one slash, " + "it cannot start with more than one slash. " + "Input endpoint was: '" + trimmed + "'",
        )
      }
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
   */
  public static async parseJSON<T_FROM_API>(resp: Response): Promise<T_FROM_API> {
    // the url the request was made to
    const url: string = resp.url

    const contentTypeHeader: string | null = resp.headers.get("content-type")
    // if the content-type is not even there
    if (!contentTypeHeader) {
      throw new Error(
        `Before parsing JSON from a response, the Content-type header from the response was not even there, ` +
          `therefore it is not possible to determine if this response contains JSON. URL was: ${url}`,
      )
    }
    const hasSentJSON = contentTypeHeader.includes("application/json")
    // if the content-type is different from application/json,
    // this will definitely not be a valid JSON
    if (!hasSentJSON) {
      throw new Error(
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
      throw new Error(
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
   * No body, no authentication.
   *
   * @param method the request method (GET, POST etc.)
   */
  public static getFetchConfigFor(method: RequestMethod): RequestInit
  /**
   * Custom authentication, no body.
   *
   * @param method the request method (GET, POST etc.)
   * @param requireLogin whether you require the user to be authenticated/logged in.
   *  this will add an Authorization: Bearer xyz header to the request
   */
  public static getFetchConfigFor(method: RequestMethod, requireLogin: boolean): RequestInit
  /**
   * Custom authentication, custom body.
   *
   * @param method the request method (GET, POST etc.)
   * @param requireLogin whether you require the user to be authenticated/logged in.
   *  this will add an Authorization: Bearer xyz header to the request
   * @param body valid JS object
   */
  public static getFetchConfigFor(method: RequestMethod, requireLogin: boolean, body: object): RequestInit
  /**
   * Get a default configuration object to
   * pass directly to the fetch function,
   * based on request method (GET, POST etc.).
   * Avoids having to pass fetch config manually.
   */
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
            `however an invalid object was given, or the object is not a plain JS object. Input object was: ${body}`,
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
      ...config.headers
    }

    let requestInit: RequestInit = {
      method,
      headers,
      body: methodRequiresJSONBody ? config.body : null 
    }

    return requestInit

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
