// LANGUAGES
export enum Language {
  EN = "en",
  IT = "it"
}


// ROUTES

export const AppRoutes = {
  // *****************
  // AUTHENTICATION
  // *****************

  // signup
  signup: "/auth/signup",
  // login
  login: "/auth/login",
  loginOperator: "/auth/login-operator",
  // forgot password
  forgotPasswordProvideEmail: "/auth/forgot-password",
  forgotPasswordSetNewPassword: "/auth/forgot-password/verify/:code",
  forgotPasswordSetNewPasswordWith: (code: string) => `/auth/forgot-password/verify/${code}`,

  // *****************
  // LOGGED IN
  // *****************

  // dashboard
  dashboard: "/u/dashboard",
  myProfile: "/u/me",
  editMyProfile: "/u/me/edit",
  myArticles: "/u/my-articles",
  addMyArticle: "/u/my-articles/add",
  editMyArticle: "/u/my-articles/:articleId/edit",
  editMyArticleWith: (articleId: string) => `/u/my-articles/${articleId}/edit`,
  uploadCV: `/u/cv/upload`

} as const

// custom events of the app
// by "events" we mean actual JS events
export enum AppEvent {
  APP_SUCCESS = "APP_SUCCESS",
  APP_ERROR = "APP_ERROR"
}

export enum AppEventMessageType {
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGOUT_SUCCESS = "LOGOUT_SUCCESS",
  WRONG_CREDENTIALS = "WRONG_CREDENTIALS",
  MUST_VERIFY_EMAIL = "MUST_VERIFY_EMAIL",
  NETWORK_ERROR = "NETWORK_ERROR",
  EXPECTED_JSON_PAYLOAD = "EXPECTED_JSON_PAYLOAD",
  SIGNUP_SUCCESS = "SIGNUP_SUCCESS",
  SIGNUP_CANNOT_USE_EMAIL = "SIGNUP_CANNOT_USE_EMAIL",
  INVALID_FIELDS = "INVALID_FIELDS",
  SAVED_SUCCESS = "SAVED_SUCCESS",
  SERVER_ERROR = "SERVER_ERROR",
  BAD_REQUEST = "BAD_REQUEST",
}

export const AppEventMessage: Record<Language, Record<AppEventMessageType, string>> = {

  [Language.EN]: {
    LOGIN_SUCCESS: "Welcome back.",
    LOGOUT_SUCCESS: "You've been logged out.",
    WRONG_CREDENTIALS: "Wrong credentials.",
    MUST_VERIFY_EMAIL: "You need to verify your email first. We've just sent you a unique verification link in your inbox.",
    NETWORK_ERROR: "There was a network error. Either you are offline, or the server is offline.",
    EXPECTED_JSON_PAYLOAD: "Internal error (expected JSON payload)",
    SIGNUP_SUCCESS: "Successful signup. Check your inbox: We've just sent you an email to verify that it's you.",
    SIGNUP_CANNOT_USE_EMAIL:  "You cannot use this email.",
    INVALID_FIELDS: "Some fields are invalid. Details: ",
    SAVED_SUCCESS: "Saved.",
    SERVER_ERROR: "Your request has successfully reached the server, but there was a problem in the server.",
    BAD_REQUEST: "Your request could not be processed because it's malformed "
                  +"or this specific action cannot be performed."
  },

  [Language.IT]: {
    LOGIN_SUCCESS: "Bentornato.",
    LOGOUT_SUCCESS: "Hai effettuato il logout.",
    WRONG_CREDENTIALS: "Credenziali errate.",
    MUST_VERIFY_EMAIL: "Devi verificare la tua email prima di continuare. Ti abbiamo appena inviato un link di verifica.",
    NETWORK_ERROR: "Errore di rete. Sei offline o il server non è raggiungibile.",
    EXPECTED_JSON_PAYLOAD: "Errore interno (payload JSON atteso).",
    SIGNUP_SUCCESS: "Registrazione completata. Controlla la tua casella email: ti abbiamo inviato un link per verificare la tua identità.",
    SIGNUP_CANNOT_USE_EMAIL: "Non puoi utilizzare questa email.",
    INVALID_FIELDS: "Alcuni campi non sono validi. Dettagli: ",
    SAVED_SUCCESS: "Salvato.",
    SERVER_ERROR: "La richiesta è arrivata al server, ma si è verificato un errore interno.",
    BAD_REQUEST: "La richiesta non può essere elaborata perché è malformata "
              +"o questa azione non è consentita."
  },

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

// NOTIFICATION

export interface NotificationFromAPI {
  notificationId: string
  type: string
  title: string
  body: string
  createdAt: string
  readAt: string | null
  expiresAt: string | null
}

export interface EnrichedNotificationFromAPI extends NotificationFromAPI {
  createdAtAgo: string
}

export interface NotificationsPageFromAPI extends Pagination<NotificationFromAPI> {}

export interface EnrichedNotificationsPageFromAPI extends Pagination<EnrichedNotificationFromAPI> {}



// MANAGER LOGIN

export interface LoginToAPI {
  email: string
  password: string
}


// OPERATOR LOGIN

export interface OperatorLoginToAPI {
  username: string
  password: string
}


export interface LoginFromAPI {
  accessToken: string
}

// SIGNUP

export interface SignupToAPI {
  // company name
  legalName: string
  // owner's name
  firstname: string
  lastname: string
  email: string
  password: string
}

export interface SignupFromAPI {
  userId: string
}

// FORGOT PASSWORD

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


