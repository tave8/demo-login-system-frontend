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

export type FetchMethodType = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export type FetchHeaderContentTypeType = "application/json"

export interface FetchHeadersType {
  authorization?: string
  "content-type": FetchHeaderContentTypeType
}

export interface FetchConfigType {
  method: FetchMethodType
  headers: FetchHeadersType
  body?: object
}
