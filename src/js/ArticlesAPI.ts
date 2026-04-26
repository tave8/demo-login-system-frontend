import APIHelper from "./APIHelper"
import BaseAPI from "./BaseAPI"
import {
  RequestMethod,
  RequireLogin,
  ArticleFromAPI,
  EnrichedArticleFromAPI,
  ArticleToAPI,
  ArticlesPageFromAPI,
  EnrichedArticlesPageFromAPI,
  UpdatedArticleToAPI,
} from "./my_types"
import TimeHelper from "./TimeHelper"

export default class ArticlesAPI extends BaseAPI {
  constructor() {
    // call new BaseAPI()
    super()
  }

  /**
   * Enrich a pagination page.
   */
  private enrichPage(page: ArticlesPageFromAPI): EnrichedArticlesPageFromAPI {
    const enrichedItems = this.enrichItems(page.content)
    return {
      ...page,
      content: enrichedItems,
    }
  }

  private enrichItems(items: ArticleFromAPI[]): EnrichedArticleFromAPI[] {
    return items.map((item) => this.enrichItem(item))
  }

  /**
   * Enriches an article coming from the API.
   * It only adds new fields.
   */
  private enrichItem(item: ArticleFromAPI): EnrichedArticleFromAPI {
    return {
      ...item,
      relativeTimeFormatted: TimeHelper.toRelativeTime(item.createdAt),
    }
  }

  /**
   * Add an article of the currently
   * logged in user.
   */
  public async addMyArticle(newArticle: ArticleToAPI): Promise<ArticleFromAPI> {
    const config = APIHelper.getFetchConfigFor(RequestMethod.POST, RequireLogin.YES, newArticle)

    const resp: Response = await APIHelper.doFetchAt("/articles", config)

    const data = await APIHelper.parseJSON<ArticleFromAPI>(resp)

    return data
  }

  /**
   * Get articles of the currently
   * logged in user.
   */
  public async getMyArticles(): Promise<ArticlesPageFromAPI> {
    const config = APIHelper.getFetchConfigFor(RequestMethod.GET, RequireLogin.YES)

    const resp: Response = await APIHelper.doFetchAt("/articles", config)

    const data = await APIHelper.parseJSON<ArticlesPageFromAPI>(resp)

    return data
  }

  /**
   * Get article by ID of the currently
   * logged in user.
   */
  public async getMyArticleById(articleId: string): Promise<ArticleFromAPI> {
    const config = APIHelper.getFetchConfigFor(RequestMethod.GET, RequireLogin.YES)

    const resp: Response = await APIHelper.doFetchAt(`/articles/${articleId}`, config)

    const data = await APIHelper.parseJSON<ArticleFromAPI>(resp)

    return data
  }

  /**
   * Get article by ID of the currently
   * logged in user.
   */
  public async getMyArticleByIdEnriched(articleId: string): Promise<EnrichedArticleFromAPI> {
    const item = await this.getMyArticleById(articleId)
    return this.enrichItem(item)
  }

  /**
   * Update article by ID of the currently
   * logged in user.
   */
  public async updateMyArticleById(articleId: string, updatedArticle: UpdatedArticleToAPI): Promise<ArticleFromAPI> {
    const config = APIHelper.getFetchConfigFor(RequestMethod.PUT, RequireLogin.YES, updatedArticle)

    const resp: Response = await APIHelper.doFetchAt(`/articles/${articleId}`, config)

    const data = await APIHelper.parseJSON<ArticleFromAPI>(resp)

    return data
  }

  /**
   * Update article (enriched) by ID of the currently
   * logged in user.
   */
  public async updateMyArticleByIdEnriched(articleId: string, updatedArticle: UpdatedArticleToAPI): Promise<EnrichedArticleFromAPI> {
    const item = await this.updateMyArticleById(articleId, updatedArticle)
    return this.enrichItem(item)
  }

  /**
   * Delete article by ID of the currently
   * logged in user.
   */
  public async deleteMyArticleById(articleId: string): Promise<void> {
    const config = APIHelper.getFetchConfigFor(RequestMethod.DELETE, RequireLogin.YES)

    const resp: Response = await APIHelper.doFetchAt(`/articles/${articleId}`, config)

    await APIHelper.parseJSON<void>(resp)

  }

  /**
   * Get articles (enriched) of the currently
   * logged in user.
   */
  public async getMyArticlesEnriched(): Promise<EnrichedArticlesPageFromAPI> {
    const page = await this.getMyArticles()
    return this.enrichPage(page)
  }
}
