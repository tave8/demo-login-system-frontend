// sign up

import APIHelper from "./APIHelper"
import BaseAPI from "./BaseAPI"
import { UserDataType } from "./my_types"

export default class UsersAPI extends BaseAPI {
  constructor() {
    // call new BaseAPI()
    super()
  }

  /**
   * Get the info/profile of the currently
   * logged in user.
   */
  public async getMyInfo(): Promise<UserDataType> {
    const defaultConfig = {
      headers: {
        authorization: APIHelper.getAuthorizationHeaderValue(),
      },
    }
    const moreConfig = {}
    const finalConfig = { ...defaultConfig, ...moreConfig }

    // server url
    const url = APIHelper.getAPIUrlAt("/users/me")

    let resp: Response

    try {
      resp = await fetch(url, finalConfig)
    } catch (err) {
      throw new Error(`Error DURING fetch. Details: ${err}`)
    }

    try {
      if (!resp.ok) {
        throw new Error(`Error AFTER fetch. Response status code: ${resp.status}`)
      }
    } catch (err) {
      throw err
    }

    const data: UserDataType = await resp.json()

    return data
  }
}
