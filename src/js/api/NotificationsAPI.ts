import BaseAPI from "./BaseAPI.ts";
import {
    ArticleFromAPI,
    ArticlesPageFromAPI, EnrichedArticleFromAPI, EnrichedArticlesPageFromAPI, EnrichedNotificationFromAPI,
    EnrichedNotificationsPageFromAPI,
    NotificationFromAPI, NotificationsPageFromAPI, RequestMethod, RequireLogin, UpdatedArticleToAPI, UserFromAPI
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
     * Main method for getting notifications.
     * Other get notifications methods should call it.
     */
    public async getMyNotifications(filterRead: boolean | null,
                                    notificationType: string | null): Promise<NotificationsPageFromAPI>
    {

        // *****************
        // BUILD QUERY PARAMS FROM FILTERS
        // *****************

        const params = new URLSearchParams();

        // if the filters are not null, it means we want to filter,
        // so we add it as query param
        if (filterRead !== null) params.append("filterRead", String(filterRead));

        if (notificationType !== null) params.append("type", notificationType);

        const url = `/notifications?${params.toString()}`;

        // *****************
        // MAKE REQUEST
        // *****************

        const config = APIHelper.getFetchConfigFor(RequestMethod.GET, RequireLogin.YES)

        const resp: Response = await this.doFetchAt(url, config)

        const data = await this.parseJSON<NotificationsPageFromAPI>(resp)

        return data
    }


    /**
     * Get my notifications (enriched = extra fields)
     *
     * @param filterRead
     * @param notificationType
     */
    public async getMyNotificationsEnriched(filterRead: boolean | null,
                                            notificationType: string | null): Promise<EnrichedNotificationsPageFromAPI>
    {

        const page = await this.getMyNotifications(filterRead, notificationType)
        return this.enrichPage(page)

    }


    public async getMyUnreadNotificationsEnriched(): Promise<EnrichedNotificationsPageFromAPI>
    {

        return await this.getMyNotificationsEnriched(false, null)

    }

    public async getMyUnreadNotificationsOfTypeEnriched(notificationType: string): Promise<EnrichedNotificationsPageFromAPI>
    {

        return await this.getMyNotificationsEnriched(false, notificationType)

    }


    public async getMyReadNotificationsEnriched(): Promise<EnrichedNotificationsPageFromAPI>
    {

        return await this.getMyNotificationsEnriched(true, null)

    }

    /**
     * Mark notification as read.
     */
    public async markNotificationAsRead(notificationId: string): Promise<NotificationFromAPI> {
        const config = APIHelper.getFetchConfigFor(RequestMethod.PATCH, RequireLogin.YES)

        const resp: Response = await this.doFetchAt(`/notifications/${notificationId}/read`, config)

        const data = await this.parseJSON<NotificationFromAPI>(resp)

        return data
    }

    public async markNotificationAsReadEnriched(notificationId: string): Promise<EnrichedNotificationFromAPI> {
        const item = await this.markNotificationAsRead(notificationId)
        return this.enrichItem(item)
    }

}