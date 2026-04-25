import APIHelper from "./APIHelper"
import BaseAPI from "./BaseAPI"
import { RequestMethod, RequireLogin, ArticleFromAPI, EnrichedArticleFromAPI, ArticleToAPI, ArticlesPageFromAPI, EnrichedArticlesPageFromAPI } from "./my_types"
import TimeHelper from "./TimeHelper"

type ITEM_TO_API = ArticleToAPI
type ITEM_FROM_API = ArticleFromAPI
type ENRICHED_ITEM_FROM_API = EnrichedArticleFromAPI
type PAGE_FROM_API = ArticlesPageFromAPI
type ENRICHED_PAGE_FROM_API = EnrichedArticlesPageFromAPI

export default class ArticlesAPI extends BaseAPI {
  constructor() {
    // call new BaseAPI()
    super()
  }

  /**
   * Enrich a pagination page.
   */
  private enrichPage(page: PAGE_FROM_API): ENRICHED_PAGE_FROM_API {
    const enrichedItems = this.enrichItems(page.content)
    return {
      ...page,
      content: enrichedItems,
    }
  }

  private enrichItems(items: ITEM_FROM_API[]): ENRICHED_ITEM_FROM_API[] {
    return items.map((item) => this.enrich(item))
  }

  /**
   * Enriches an article coming from the API.
   * It only adds new fields.
   */
  private enrich(item: ITEM_FROM_API): ENRICHED_ITEM_FROM_API {
    return {
      ...item,
      relativeTimeFormatted: TimeHelper.toRelativeTime(item.createdAt),
    }
  }

  /**
   * Add an article of the currently
   * logged in user.
   */
  public async addMyArticle(articleData: ITEM_TO_API): Promise<ITEM_FROM_API> {
    const config = APIHelper.getFetchConfigFor(RequestMethod.POST, RequireLogin.YES, articleData)

    const resp: Response = await APIHelper.doFetchAt("/articles", config)

    const data = await APIHelper.parseJSON<ITEM_FROM_API>(resp)

    return data
  }

  /**
   * Get articles of the currently
   * logged in user.
   */
  public async getMyArticles(): Promise<PAGE_FROM_API> {
    const config = APIHelper.getFetchConfigFor(RequestMethod.GET, RequireLogin.YES)

    const resp: Response = await APIHelper.doFetchAt("/articles", config)

    const data = await APIHelper.parseJSON<PAGE_FROM_API>(resp)

    return data
  }

  /**
   * Get articles (enriched) of the currently
   * logged in user.
   */
  public async getMyArticlesEnriched(): Promise<ENRICHED_PAGE_FROM_API> {
    const page = await this.getMyArticles()
    return this.enrichPage(page)
  }
}
