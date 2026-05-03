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

