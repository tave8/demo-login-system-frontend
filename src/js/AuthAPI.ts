// sign up

import SignupData from "./SignupData"

export default class AuthAPI {
  constructor() {}

  /**
   * Signs up a user.
   */
  async signup(signupData: SignupData) {
    console.log(signupData)
  }
}
