// LANGUAGES
export enum Language {
  EN = "en",
  IT = "it"
}

export enum DayOfWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY"
}

export const DAY_LABELS: Record<Language, Record<DayOfWeek, string>> = {
  [Language.IT]: {
    [DayOfWeek.MONDAY]: "Lunedì",
    [DayOfWeek.TUESDAY]: "Martedì",
    [DayOfWeek.WEDNESDAY]: "Mercoledì",
    [DayOfWeek.THURSDAY]: "Giovedì",
    [DayOfWeek.FRIDAY]: "Venerdì",
    [DayOfWeek.SATURDAY]: "Sabato",
    [DayOfWeek.SUNDAY]: "Domenica",
  },
  [Language.EN]: {
    [DayOfWeek.MONDAY]: "Monday",
    [DayOfWeek.TUESDAY]: "Tuesday",
    [DayOfWeek.WEDNESDAY]: "Wednesday",
    [DayOfWeek.THURSDAY]: "Thursday",
    [DayOfWeek.FRIDAY]: "Friday",
    [DayOfWeek.SATURDAY]: "Saturday",
    [DayOfWeek.SUNDAY]: "Sunday",
  }
}

// ROUTES

export const AppRoutes = {

  root: "/",

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

  invalidEmailVerification: "/u/auth/invalid-email-verification",

  unauthorized: "/auth/unauthorized",

  // *****************
  // LOGGED IN
  // *****************

  // admin only
  users: "/u/users",
  addUser: "/u/users/add",

  clients: "/u/clients",
  addClient: "/u/clients/add",

  clientAddresses: "/u/client-addresses",
  addClientAddress: "/u/client-addresses/add",

  // url pattern
  contractExpectation: `/client-addresses/:clientAddressId/contract-expectations`,

  // see the contract expectations of this client address
  contractExpectationWith: (clientAddressId: string) => `/client-addresses/${clientAddressId}/contract-expectations`,

  addChecklistToClientAddress: "/u/client-addresses/checklists/add",

  tasks: "/u/tasks",
  addTask: "/u/tasks/add",

  checklists: "/u/checklists",
  addChecklist: "/u/checklists/add",

  shifts: "/u/shifts",
  addShift: "/u/shifts/add",

  // DASHBOARDS
  // use this when you don't know the user role
  // (for example backend should use it)
  dashboard: "/u/dashboard",

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
  EMAIL_VERIFICATION_SUCCESS = "EMAIL_VERIFICATION_SUCCESS",
  MUST_CHANGE_PASSWORD = "MUST_CHANGE_PASSWORD",
  NETWORK_ERROR = "NETWORK_ERROR",
  EXPECTED_JSON_PAYLOAD = "EXPECTED_JSON_PAYLOAD",
  SIGNUP_SUCCESS = "SIGNUP_SUCCESS",
  CANNOT_USE_EMAIL = "CANNOT_USE_EMAIL",
  CANNOT_SET_PASSWORD_NOW = "CANNOT_SET_PASSWORD_NOW",
  INVALID_FIELDS = "INVALID_FIELDS",
  SAVE_SUCCESS = "SAVE_SUCCESS",
  SAVE_ERROR = "SAVE_ERROR",
  COPIED = "COPIED",
  SERVER_ERROR = "SERVER_ERROR",
  BAD_REQUEST = "BAD_REQUEST",
  AUTHORIZATION_SET_PASSWORD_SUCCESS = "AUTHORIZATION_SET_PASSWORD_SUCCESS",
  SET_PASSWORD_SUCCESS = "SET_PASSWORD_SUCCESS"
}


export const AppEventMessage: Record<Language, Record<AppEventMessageType, string>> = {

  [Language.EN]: {
    LOGIN_SUCCESS: "Welcome back.",
    LOGOUT_SUCCESS: "You've been logged out.",
    WRONG_CREDENTIALS: "Wrong credentials.",
    MUST_VERIFY_EMAIL: "You need to verify your email first. We've just sent you a unique verification link in your inbox.",
    EMAIL_VERIFICATION_SUCCESS: "Your email was verified. You can login.",
    MUST_CHANGE_PASSWORD: "You must change your password before accessing your area.",
    NETWORK_ERROR: "There was a network error. Either you are offline, or the server is offline.",
    EXPECTED_JSON_PAYLOAD: "Internal error (expected JSON payload)",
    SIGNUP_SUCCESS: "Successful signup. Check your inbox: We've just sent you an email to verify that it's you.",
    CANNOT_USE_EMAIL:  "You cannot use this email.",
    CANNOT_SET_PASSWORD_NOW: "You cannot set a new password right now.",
    INVALID_FIELDS: "Some fields are invalid. Details: ",
    SAVE_SUCCESS: "Saved.",
    SAVE_ERROR: "There was an error while saving.",
    COPIED: "Copied",
    SERVER_ERROR: "Your request has successfully reached the server, but there was a problem in the server.",
    BAD_REQUEST: "Your request could not be processed because it's malformed "
                  +"or this specific action cannot be performed.",
    AUTHORIZATION_SET_PASSWORD_SUCCESS: "We've just sent you an email with a unique authorization link. "
                                        +"For your security, the link will expire soon and can only be used once.",
    SET_PASSWORD_SUCCESS: "You've successfully reset your password. "
                            +"You can now login with this new password."
  },

  [Language.IT]: {
    LOGIN_SUCCESS: "Bentornato.",
    LOGOUT_SUCCESS: "Hai effettuato il logout.",
    WRONG_CREDENTIALS: "Credenziali errate.",
    MUST_VERIFY_EMAIL: "Devi verificare la tua email prima di continuare. Ti abbiamo appena inviato un link di verifica.",
    EMAIL_VERIFICATION_SUCCESS: "La tua email è stata verificata. Puoi fare login.",
    MUST_CHANGE_PASSWORD: "Devi cambiare la tua passwod prima di accedere alla tua area.",
    NETWORK_ERROR: "Errore di rete. Sei offline o il server non è raggiungibile.",
    EXPECTED_JSON_PAYLOAD: "Errore interno (payload JSON atteso).",
    SIGNUP_SUCCESS: "Registrazione completata. Controlla la tua casella email: ti abbiamo inviato un link per verificare la tua identità.",
    CANNOT_USE_EMAIL: "Non puoi utilizzare questa email.",
    CANNOT_SET_PASSWORD_NOW: "Non puoi impostare una nuova password adesso.",
    INVALID_FIELDS: "Alcuni campi non sono validi. Dettagli: ",
    SAVE_SUCCESS: "Salvato.",
    SAVE_ERROR: "C'è stato un errore durante il salvataggio.",
    COPIED: "Copiato.",
    SERVER_ERROR: "La richiesta è arrivata al server, ma si è verificato un errore interno.",
    BAD_REQUEST: "La richiesta non può essere elaborata perché è malformata "
              +"o questa azione non è consentita.",
    AUTHORIZATION_SET_PASSWORD_SUCCESS: "Ti abbiamo appena mandato un email con un link unico di autorizzazione. "
                                        + "Per la tua sicurezza, il link scadrà a breve e può essere usato solo una volta.",
    SET_PASSWORD_SUCCESS: "Hai reimpostato la tua password con successo. "
                          + "Ora puoi accedere con la nuova password."
  },

}


/**
 * When a background job is accepted from API.
 */
export interface BackgroundJobAcceptedFromAPI {
  message: string
  timestamp: string
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



// *********************************
// CONTRACT EXPECTATION
// a contract expectation is associated to a client address


/**
 * Instead of using this interface, use ContractExpectationFromAPI interface,
 * because it also contains useful state-related information such as
 * exists, pending etc.
 */
export interface ContractExpectationDetailFromAPI {
  id: string
  clientAddressId: string
  state: string
  // the text extracted from AI, that represents
  // the expectations in the contract with the client address
  expectations: string
  processedAt: string
}

/**
 * Use this when retrieving the contract expectation from API.
 */
export interface ContractExpectationFromAPI {
  exists: boolean
  pending: boolean
  failed: boolean
  success: boolean
  // if the contract expectation does not exist,
  // value is null
  detail: ContractExpectationDetailFromAPI | null
}

/**
 * This is what we send to the API when the user
 * updates the contract expectation.
 */
export interface UpdatedContractExpectationToAPI {
  // the updated expectations to send
  expectations: string
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
  // this the actual ID of the association
  // so if you want to reference to the client address ID
  // as an association, this is what you need to use
  id: string
  clientId: string
  addressId: string
  addressName: string
  clientName: string
  addressDisplayName: string
  addressLat: number
  addressLon: number,
  contractExpectation: ContractExpectationFromAPI
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

export interface ChecklistEntryFromAPI {
  id: string
  taskId: string
  checklistId: string
  taskName: string
  position: string
}


export interface ChecklistFromAPI {
  id: string
  name: string
  entries: ChecklistEntryFromAPI[]
}


// enriched item extends item
export interface EnrichedChecklistFromAPI extends ChecklistFromAPI {
}

// item's page extends page
export interface ChecklistsPageFromAPI extends Pagination<ChecklistFromAPI> {}

// enriched item's page extends enriched page
export interface EnrichedChecklistsPageFromAPI extends Pagination<EnrichedChecklistFromAPI> {}



// ******************************
// CLIENT ADDRESS CHECKLIST
// the combination between a checklist and a client address


export interface ClientAddressChecklistFromAPI {
  id: string
  clientAddressId: string
  checklistId: string
}


export interface ClientAddressQueryParamsToAPI {
  q: string
}



// *********************************************
// SHIFTS

export interface ShiftQueryParamsToAPI {
  // valid ISO 8601 date (year-month-day)
  from?: string
  // valid ISO 8601 date (year-month-day)
  to?: string
  // only use when you're getting back operators, not shifts
  // it means "filter in if the operator has shifts"
  // or "filter in if the operator has no shifts"
  hasShifts?: boolean
}

export interface ShiftToAPI {
  clientAddressId: string
  checklistId: string
  // list of operator id's to assign to this shift
  // can be empty, but must be there
  operatorIds: string[]
  startDate: string
  endDate: string|null
  startTime: string
  endTime: string
  days: DayOfWeek[]
}

export interface ShiftDayFromAPI {
  id: string
  shiftId: string
  day: DayOfWeek
}


export interface ShiftFromAPI {
  id: string
  clientAddress: ClientAddressFromAPI
  checklist: ChecklistFromAPI
  days: ShiftDayFromAPI[]
  operators: UserFromAPI[]
  startDate: string
  endDate: string|null
  startTime: string
  endTime: string
}


export interface OperatorShiftConflictsFromAPI {
    hasConflicts: boolean
    startDate: string
    endDate: string
    startTime: string
    endTime: string
    shifts: ShiftFromAPI[]
}

// enriched item extends item
// export interface EnrichedChecklistFromAPI extends ChecklistFromAPI {
// }

// item's page extends page
// export interface ShiftsPageFromAPI extends Pagination<ChecklistFromAPI> {}

// enriched item's page extends enriched page
// export interface EnrichedChecklistsPageFromAPI extends Pagination<EnrichedChecklistFromAPI> {}




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


