// ROUTES

export const AppRoutes = {
  dashboard: "/dashboard",
  login: "/login",
  signup: "/signup",
  home: "/",
  myProfile: "/me",
  editMyProfile: "/me/edit",
  myArticles: "/my-articles",
  addMyArticle: "/my-articles/add",
  editMyArticle: "/my-articles/:articleId/edit",
  editMyArticleWith: (articleId: string) => `/my-articles/${articleId}/edit`,
  forgotPasswordProvideEmail: "/forgot-password",
  forgotPasswordSetNewPassword: "/forgot-password/verify/:code",
  forgotPasswordSetNewPasswordWith: (code: string) => `/forgot-password/verify/${code}`,
  uploadCV: `/cv/upload`
} as const

// custom events of the app
// by "events" we mean actual JS events
export enum AppEvent {
  APP_SUCCESS = "APP_SUCCESS",
  APP_ERROR = "APP_ERROR"
}

export enum AppEventMessage {
  LOGIN_SUCCESS = "Welcome back.",
  WRONG_CREDENTIALS = "Wrong credentials.",
  MUST_VERIFY_EMAIL = "You need to verify your email first. We've just sent you a unique verification link in your inbox.",
  NETWORK_ERROR = "There was a network error. Please check your connection.",
  EXPECTED_JSON_PAYLOAD = "Internal error (expected JSON payload)",
  SIGNUP_SUCCESS = "Successful signup. Check your inbox: We've just sent you an email to verify that it's you.",
  SIGNUP_CANNOT_USE_EMAIL =  "You cannot use this email.",
  INVALID_FIELDS = "Some fields are invalid. Details: "
}

// PAGINATION

interface PaginationSort {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

interface PaginationPageable {
  offset: number
  pageNumber: number
  pageSize: number
  paged: boolean
  sort: PaginationSort
  unpaged: boolean
}

interface Pagination<T> {
  content: T[]
  empty: boolean
  first: boolean
  last: boolean
  number: number
  numberOfElements: number
  pageable: PaginationPageable
  size: number
  sort: PaginationSort
  totalElements: number
  totalPages: number
}

// LOGIN & SIGNUP

export interface LoginToAPI {
  email: string
  password: string
}

export interface LoginFromAPI {
  accessToken: string
}

export interface SignupToAPI {
  firstname: string
  lastname: string
  email: string
  password: string
}

export interface SignupFromAPI {
  userId: string
}

export interface ForgotPasswordRequestToAPI {
  email: string
}

export interface ForgotPasswordRequestFromAPI {
  message: string
}

export interface ForgotPasswordVerifyCodeToAPI {
  code: string
}

export interface ForgotPasswordVerifyCodeFromAPI {
  message: string
}


export interface ForgotPasswordNewPasswordToAPI {
  newPassword: string
  code: string
}

export interface ForgotPasswordNewPasswordFromAPI {
  message: string
}


// USERS

export interface UpdatedUserToAPI {
  firstname: string
  lastname: string
}

export interface UserFromAPI {
  firstname: string
  lastname: string
  email: string
  avatarUrl: string
}

// ARTICLES

export interface ArticleToAPI {
  title: string
  content: string
}

export interface UpdatedArticleToAPI {
  title: string
  content: string
}

export interface ArticleFromAPI {
  articleId: string
  title: string
  content: string
  coverUrl: string
  createdAt: string
}

export interface EnrichedArticleFromAPI extends ArticleFromAPI {
  relativeTimeFormatted: string
}

export interface ArticlesPageFromAPI extends Pagination<ArticleFromAPI> {}

export interface EnrichedArticlesPageFromAPI extends Pagination<EnrichedArticleFromAPI> {}

export type MaybeFile = File | null

// FETCH CONFIG TYPES

export const RequireLogin = {
  YES: true,
  NO: false,
} as const

export enum RequestMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export enum RequestHeaderContentType {
  APPLICATION_JSON = "application/json",
}

export interface FetchHeadersType {
  authorization?: string
  "content-type"?: RequestHeaderContentType
}

export interface FetchConfigType {
  method: RequestMethod
  headers: FetchHeadersType
  body?: string
}

// OTHER SERVER RESPONSES

export interface ErrorPayloadFromAPI {
   errors: string[]
   message: string
   timestamp: string
}

