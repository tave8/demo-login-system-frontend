import APIHelper from "./APIHelper"
import BaseAPI from "./BaseAPI"
import { RequestMethod, RequireLogin } from "./my_types"

export default class ArticlesAPI<T_TO_API extends object, T_FROM_API extends object> extends BaseAPI {
  constructor() {
    // call new BaseAPI()
    super()
  }

  /**
   * Add an article of the currently
   * logged in user.
   */
  public async addMyArticle(articleData: T_TO_API): Promise<T_FROM_API> {
    const config = APIHelper.getFetchConfigFor(RequestMethod.POST, RequireLogin.YES, articleData)

    const resp: Response = await APIHelper.doFetchAt("/articles", config)

    const data = await APIHelper.parseJSON<T_FROM_API>(resp)

    return data
  }

  /**
   * Get articles of the currently
   * logged in user.
   */
  public async getMyArticles(): Promise<T_FROM_API[]> {
    const config = APIHelper.getFetchConfigFor(RequestMethod.GET, RequireLogin.YES)

    const resp: Response = await APIHelper.doFetchAt("/articles", config)

    const data = await APIHelper.parseJSON<T_FROM_API[]>(resp)

    return data
  }
}
