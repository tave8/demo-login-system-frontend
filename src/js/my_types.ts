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
