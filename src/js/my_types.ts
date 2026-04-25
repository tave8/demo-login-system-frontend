export interface LoginForAPI {
  email: string
  password: string
}

export interface LoginFromAPI {
  accessToken: string
}

export interface SignupForAPI {
  firstname: string
  lastname: string
  email: string
  password: string
}

export interface SignupFromAPI {
  userId: string
}

export interface UserDataType {
  firstname: string
  lastname: string
  email: string
  avatarUrl: string
}

// FETCH CONFIG TYPES

export enum FetchMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export enum FetchHeaderContentType {
  APPLICATION_JSON = "application/json",
}

export interface FetchHeadersType {
  authorization?: string
  "content-type"?: FetchHeaderContentType
}

export interface FetchConfigType {
  method: FetchMethod
  headers: FetchHeadersType
  body?: object
}
