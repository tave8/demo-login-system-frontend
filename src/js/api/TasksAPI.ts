

import APIHelper from "./APIHelper"
import BaseAPI from "./BaseAPI"
import FileHelper from "../helpers/FileHelper"
import {
    ArticleFromAPI,
    ArticlesPageFromAPI, ClientAddressesPageFromAPI,
    ClientAddressFromAPI, ClientAddressToAPI, ClientFromAPI, ClientQueryParamsToAPI, ClientsPageFromAPI,
    ClientToAPI, EnrichedArticleFromAPI, EnrichedArticlesPageFromAPI, EnrichedClientAddressesPageFromAPI,
    EnrichedClientAddressFromAPI,
    EnrichedClientFromAPI,
    EnrichedClientsPageFromAPI, EnrichedTaskFromAPI, EnrichedTasksPageFromAPI,
    EnrichedUserFromAPI, EnrichedUsersPageFromAPI,
    NewUserFromAPI,
    NewUserToAPI,
    RequestMethod,
    RequireLogin, TaskFromAPI, TasksPageFromAPI, TaskToAPI,
    UpdatedUserToAPI,
    UserFromAPI, UsersPageFromAPI
} from "../my_types"
import TimeHelper from "../helpers/TimeHelper.ts";
import UserRoleHelper from "../helpers/UserRoleHelper.ts";

export default class TasksAPI extends BaseAPI {

    private static instance: TasksAPI

    constructor() {
        // call new BaseAPI()
        super()
    }

    /**
     * (Uses singleton design pattern)
     */
    public static getInstance(): TasksAPI {
        if(this.instance == null) {
            this.instance = new TasksAPI()
        }
        return this.instance
    }


    /**
     * Enrich a pagination page.
     */
    private enrichPage(page: TasksPageFromAPI): EnrichedTasksPageFromAPI {
        const enrichedItems = this.enrichItems(page.content)
        return {
            ...page,
            content: enrichedItems,
        }
    }

    private enrichItems(items: TaskFromAPI[]): EnrichedTaskFromAPI[] {
        return items.map((item) => this.enrichItem(item))
    }

    /**
     * Enriches an item coming from the API.
     */
    private enrichItem(item: TaskFromAPI): EnrichedTaskFromAPI {
        return {
            ...item,
            // add custom fields to each item
        }
    }


    /**
     * Add a task.
     */
    public async addTask(taskData: TaskToAPI): Promise<TaskFromAPI>
    {
        const config = APIHelper.getFetchConfigFor(RequestMethod.POST, RequireLogin.YES, taskData)

        const endpoint = `/tasks`

        const resp: Response = await this.doFetchAt(endpoint, config)

        const data = await this.parseJSON<TaskFromAPI>(resp)

        return data
    }

    /**
     * Get tasks.
     */
    public async getTasks(): Promise<TasksPageFromAPI> {
        const config = APIHelper.getFetchConfigFor(RequestMethod.GET, RequireLogin.YES)

        const endpoint = `/tasks`

        const resp: Response = await this.doFetchAt(endpoint, config)

        const data = await this.parseJSON<TasksPageFromAPI>(resp)

        return data
    }





}
