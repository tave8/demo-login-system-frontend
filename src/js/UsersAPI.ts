// sign up

import APIHelper from "./APIHelper"
import BaseAPI from "./BaseAPI"
import InvalidFileUploadedError from "./exceptions/InvalidFileUploadedError"
import FileHelper from "./FileHelper"
import { RequestMethod, RequireLogin, UpdatedUserToAPI, UserFromAPI } from "./my_types"

export default class UsersAPI extends BaseAPI {
  constructor() {
    // call new BaseAPI()
    super()
  }

  /**
   * Get the info/profile of the currently
   * logged in user.
   */
  public async getMyInfo(): Promise<UserFromAPI> {
    const config = APIHelper.getFetchConfigFor(RequestMethod.GET, RequireLogin.YES)

    const resp: Response = await APIHelper.doFetchAt("/users/me", config)

    const data = await APIHelper.parseJSON<UserFromAPI>(resp)

    return data
  }

  /**
   * Update the info/profile of the currently
   * logged in user.
   */
  public async updateMyInfo(updatedUser: UpdatedUserToAPI): Promise<UserFromAPI> {
    const config = APIHelper.getFetchConfigFor(RequestMethod.PUT, RequireLogin.YES, updatedUser)

    const resp: Response = await APIHelper.doFetchAt("/users/me", config)

    const data = await APIHelper.parseJSON<UserFromAPI>(resp)

    return data
  }

  /**
   * Upload my avatar image of the currently
   * logged in user.
   */
  public async uploadMyAvatarImage(avatarImage: File): Promise<UserFromAPI> {
    // if the file is empty
    if (FileHelper.isEmpty(avatarImage)) {
      throw new InvalidFileUploadedError("File is empty.")
    }
    // if file is not an image
    if (!FileHelper.isImage(avatarImage)) {
      throw new InvalidFileUploadedError("File is not an image.")
    }

    // if file is too big
    if (!FileHelper.isWithinAvatarSize(avatarImage)) {
      throw new InvalidFileUploadedError("File is too big. Must be less than 2MB.")
    }

    const config = APIHelper.getFetchConfigForFile(RequestMethod.POST, avatarImage, "avatar_image", RequireLogin.YES)

    const resp: Response = await APIHelper.doFetchAt("/users/me/avatar-image", config)

    const data = await APIHelper.parseJSON<UserFromAPI>(resp)

    return data
  }
}
