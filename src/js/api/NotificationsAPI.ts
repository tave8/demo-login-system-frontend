import BaseAPI from "./BaseAPI.ts";
import {NotificationFromAPI, NotificationsPageFromAPI, RequestMethod, RequireLogin, UserFromAPI} from "../my_types.ts";
import APIHelper from "./APIHelper.ts";

export default class NotificationsAPI extends BaseAPI {
    constructor() {
        // call new BaseAPI()
        super()
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

}