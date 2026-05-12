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

  resetPasswordFirstLogin: "/u/auth/reset-password-first-login",

  unauthorized: "/auth/unauthorized",

  // *****************
  // LOGGED IN
  // *****************

  // admin only
  users: "/u/users",
  addUser: "/u/users/add",

  clients: "/u/clients",
  addClient: "/u/clients/add",

  clientAddresses: "/u/clients/addresses",
  addClientAddress: "/u/clients/addresses/add",

  tasks: "/u/tasks",
  addTask: "/u/tasks/add",

  checklists: "/u/checklists",
  addChecklist: "/u/checklists/add",

  // DASHBOARDS

  // redirect a user to their dashboard, based on role
  dashboardOf: (role: UserRole): string => {
    if(role == UserRole.ADMIN) {
      return "/u/dashboard-admin"
    }
    if(role == UserRole.COORDINATOR) {
      return "/u/dashboard-coordinator"
    }
    if(role == UserRole.OPERATOR) {
      return "/u/dashboard-operator"
    }
    throw new Error(`Dashboard for role ${role} was not mapped.`)
  },

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
  APP_ERROR = "APP_ERROR",
  INVALID_FIELDS = "INVALID_FIELDS"
}

export enum AppEventMessageType {
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGOUT_SUCCESS = "LOGOUT_SUCCESS",
  WRONG_CREDENTIALS = "WRONG_CREDENTIALS",
  MUST_VERIFY_EMAIL = "MUST_VERIFY_EMAIL",
  MUST_CHANGE_PASSWORD = "MUST_CHANGE_PASSWORD",
  NETWORK_ERROR = "NETWORK_ERROR",
  EXPECTED_JSON_PAYLOAD = "EXPECTED_JSON_PAYLOAD",
  SIGNUP_SUCCESS = "SIGNUP_SUCCESS",
  CANNOT_USE_EMAIL = "CANNOT_USE_EMAIL",
  INVALID_FIELDS = "INVALID_FIELDS",
  SAVE_SUCCESS = "SAVE_SUCCESS",
  SAVE_ERROR = "SAVE_ERROR",
  COPIED = "COPIED",
  SERVER_ERROR = "SERVER_ERROR",
  BAD_REQUEST = "BAD_REQUEST",
}

export const AppEventMessage: Record<Language, Record<AppEventMessageType, string>> = {

  [Language.EN]: {
    LOGIN_SUCCESS: "Welcome back.",
    LOGOUT_SUCCESS: "You've been logged out.",
    WRONG_CREDENTIALS: "Wrong credentials.",
    MUST_VERIFY_EMAIL: "You need to verify your email first. We've just sent you a unique verification link in your inbox.",
    MUST_CHANGE_PASSWORD: "You must change your password before accessing your area.",
    NETWORK_ERROR: "There was a network error. Either you are offline, or the server is offline.",
    EXPECTED_JSON_PAYLOAD: "Internal error (expected JSON payload)",
    SIGNUP_SUCCESS: "Successful signup. Check your inbox: We've just sent you an email to verify that it's you.",
    CANNOT_USE_EMAIL:  "You cannot use this email.",
    INVALID_FIELDS: "Some fields are invalid. Details: ",
    SAVE_SUCCESS: "Saved.",
    SAVE_ERROR: "There was an error while saving.",
    COPIED: "Copied",
    SERVER_ERROR: "Your request has successfully reached the server, but there was a problem in the server.",
    BAD_REQUEST: "Your request could not be processed because it's malformed "
                  +"or this specific action cannot be performed."
  },

  [Language.IT]: {
    LOGIN_SUCCESS: "Bentornato.",
    LOGOUT_SUCCESS: "Hai effettuato il logout.",
    WRONG_CREDENTIALS: "Credenziali errate.",
    MUST_VERIFY_EMAIL: "Devi verificare la tua email prima di continuare. Ti abbiamo appena inviato un link di verifica.",
    MUST_CHANGE_PASSWORD: "Devi cambiare la tua passwod prima di accedere alla tua area.",
    NETWORK_ERROR: "Errore di rete. Sei offline o il server non è raggiungibile.",
    EXPECTED_JSON_PAYLOAD: "Errore interno (payload JSON atteso).",
    SIGNUP_SUCCESS: "Registrazione completata. Controlla la tua casella email: ti abbiamo inviato un link per verificare la tua identità.",
    CANNOT_USE_EMAIL: "Non puoi utilizzare questa email.",
    INVALID_FIELDS: "Alcuni campi non sono validi. Dettagli: ",
    SAVE_SUCCESS: "Salvato.",
    SAVE_ERROR: "C'è stato un errore durante il salvataggio.",
    COPIED: "Copiato.",
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


export enum UserRole {
  ADMIN = "ADMIN",
  COORDINATOR = "COORDINATOR",
  OPERATOR = "OPERATOR"
}


export const UserRoleByLanguage: Record<Language, Record<UserRole, string>>  = {

  [Language.EN]: {
    [UserRole.ADMIN]: "ADMIN",
    [UserRole.COORDINATOR]: "COORDINATOR",
    [UserRole.OPERATOR]: "OPERATOR"
  },

  [Language.IT]: {
    [UserRole.ADMIN]: "ADMIN",
    [UserRole.COORDINATOR]: "COORDINATORE",
    [UserRole.OPERATOR]: "OPERATORE"
  },

}

// "new user" is when the admin adds a user and then
// gets the temporary password

export interface NewUserToAPI {
  firstname: string
  lastname: string
  role: UserRole
  email: string
}


export interface NewUserFromAPI {
  firstname: string
  lastname: string
  username: string
  tempPassword: string
  role: UserRole
  email: string
}


// user from api is what you want to say in general,
// when getting data from api

export interface UserFromAPI {
  userId: string
  firstname: string
  lastname: string
  email: string
  avatarUrl: string
  role: UserRole
  mustChangePasswordNow: boolean
}

export interface EnrichedUserFromAPI extends UserFromAPI {
  // the role of the user in the local language
  roleInLocalLanguage: string
}

export interface UsersPageFromAPI extends Pagination<UserFromAPI> {}

export interface EnrichedUsersPageFromAPI extends Pagination<EnrichedUserFromAPI> {}



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
  message: string
  mustChangePasswordNow: boolean
  user: UserFromAPI
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

// RESET PASSWORD

export interface ResetPasswordToAPI {
  oldPassword: string
  newPassword: string
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


// CLIENT

export interface ClientToAPI {
  legalName: string
  email: string
  phone: string
  vat: string
  legalAddress: string
  legalAddressLat: number
  legalAddressLon: number
}

export interface ClientFromAPI {
  clientId: string
  legalName: string
  email: string
  phone: string
  vat: string
  legalAddress: string
  legalAddressLat: number
  legalAddressLon: number
}

export interface EnrichedClientFromAPI extends ClientFromAPI {
}

export interface ClientsPageFromAPI extends Pagination<ClientFromAPI> {}

export interface EnrichedClientsPageFromAPI extends Pagination<EnrichedClientFromAPI> {}


// the query params used to search for clients
export interface ClientQueryParamsToAPI {
  legalName: string
}


// *********************************************
// CLIENT ADDRESS (associating multiple  addresses to a client)

export interface ClientAddressToAPI {
  // the actual name of the address, example: street 8, city Milan, country Italy
  address: string
  // custom name for this address, example: Hotel The Best
  // (we also call it "address display name"
  addressName: string
  addressLat: number
  addressLon: number
}

export interface ClientAddressFromAPI {
  clientId: string
  addressId: string
  addressName: string
  clientName: string
  addressDisplayName: string
  addressLat: number
  addressLon: number
}

// enriched item extends item
export interface EnrichedClientAddressFromAPI extends ClientAddressFromAPI {
}

// item's page extends page
export interface ClientAddressesPageFromAPI extends Pagination<ClientAddressFromAPI> {}

// enriched item's page extends enriched page
export interface EnrichedClientAddressesPageFromAPI extends Pagination<EnrichedClientAddressFromAPI> {}


// ****************************************
// TASK (also known as activity)
// it's something like: clean this room, do this, do that etc.

export interface TaskToAPI {
  name: string
}


export interface TaskFromAPI {
  taskId: string
  name: string
}

// enriched item extends item
export interface EnrichedTaskFromAPI extends TaskFromAPI {
}

// item's page extends page
export interface TasksPageFromAPI extends Pagination<TaskFromAPI> {}

// enriched item's page extends enriched page
export interface EnrichedTasksPageFromAPI extends Pagination<EnrichedTaskFromAPI> {}



// ****************************************
// CHECKLIST (the things that operators must do)
// a checklist has many tasks & their positions,
// which makes them entries


export interface ChecklistSimpleEntryToAPI {
  taskId: string
  position: number
}

// export interface ChecklistEntryFromAPI {
//   taskId: string
//   checklistId: string
//   position: number
// }


export interface ChecklistWithSimpleEntriesToAPI {
  // the checklist name
  name: string
  // a list of existing tasks from DB + their position,
  // so this makes them simple entries, because they don't have
  // the checklist ID associated to it yet
  entries: ChecklistSimpleEntryToAPI[]
}


export interface ChecklistFromAPI {
  id: string
  name: string
}


// enriched item extends item
export interface EnrichedChecklistFromAPI extends ChecklistFromAPI {
}

// item's page extends page
export interface ChecklistsPageFromAPI extends Pagination<ChecklistFromAPI> {}

// enriched item's page extends enriched page
export interface EnrichedChecklistsPageFromAPI extends Pagination<EnrichedChecklistFromAPI> {}



// *********************************************
// GEOCODING (address autocomplete)

export interface GeocodingAutocompleteQueryParamsToAPI {
    q: string
    lang: string
}


// this is one result item
export interface GeocodingAutocompleteItemFromAPI {
  lat: number
  lon: number
  displayName: string
  confidence: number
  country: string
  county: string
  state: string
  resultType: string
}

export interface GeocodingAutocompleteFromAPI {
  results: GeocodingAutocompleteItemFromAPI[]
}

export interface EnrichedGeocodingAutocompleteItemFromAPI extends GeocodingAutocompleteItemFromAPI {
  // resultTypeInLocalLanguage: string
  confidenceFormatted: string
}

export interface EnrichedGeocodingAutocompleteFromAPI {
  results: EnrichedGeocodingAutocompleteItemFromAPI[]
}


//
// export interface GeocodingAutocompletePageFromAPI extends Pagination<GeocodingAutocompleteItemFromAPI> {}
//
// export interface EnrichedGeocodingAutocompletePageFromAPI extends Pagination<EnrichedGeocodingAutocompleteItemFromAPI> {}


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


