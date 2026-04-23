// sign up

import { SignupData } from "./my_types"

export default class AuthAPI {
  constructor() {}

  /**
   * Signs up a user.
   */
  async signup(signupData: SignupData) {
    console.log(signupData)
  }
}
