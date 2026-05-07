import BaseAPI from "./BaseAPI.ts";
import {
    ArticleFromAPI,
    ArticlesPageFromAPI, EnrichedArticleFromAPI, EnrichedArticlesPageFromAPI, EnrichedNotificationFromAPI,
    EnrichedNotificationsPageFromAPI,
    NotificationFromAPI, NotificationsPageFromAPI, RequestMethod, RequireLogin, UserFromAPI
} from "../my_types.ts";
import APIHelper from "./APIHelper.ts";
import TimeHelper from "../helpers/TimeHelper.ts";

export default class NotificationsAPI extends BaseAPI {
    constructor() {
        // call new BaseAPI()
        super()
    }

    /**
     * Enrich a pagination page.
     */
    private enrichPage(page: NotificationsPageFromAPI): EnrichedNotificationsPageFromAPI {
        const enrichedItems = this.enrichItems(page.content)
        return {
            ...page,
            content: enrichedItems,
        }
    }

    private enrichItems(items: NotificationFromAPI[]): EnrichedNotificationFromAPI[] {
        return items.map((item) => this.enrichItem(item))
    }

    /**
     * Enriches an article coming from the API.
     * It only adds new fields.
     */
    private enrichItem(item: NotificationFromAPI): EnrichedNotificationFromAPI {
        return {
            ...item,
            createdAtAgo: TimeHelper.toRelativeTime(item.createdAt),
        }
    }

    /**
     * Get my notifications.
     */
    public async getMyNotifications(): Promise<NotificationsPageFromAPI> {
        const config = APIHelper.getFetchConfigFor(RequestMethod.GET, RequireLogin.YES)

        const resp: Response = await this.doFetchAt("/notifications", config)

        const data = await this.parseJSON<NotificationsPageFromAPI>(resp)

        return data
    }

    public async getMyNotificationsEnriched(): Promise<EnrichedNotificationsPageFromAPI> {
        const page = await this.getMyNotifications()
        return this.enrichPage(page)
    }

}