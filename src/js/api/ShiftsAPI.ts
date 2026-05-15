

import APIHelper from "./APIHelper"
import BaseAPI from "./BaseAPI"
import FileHelper from "../helpers/FileHelper"
import {
    ArticleFromAPI,
    ArticlesPageFromAPI, ChecklistsPageFromAPI, ClientAddressesPageFromAPI,
    ClientAddressFromAPI, ClientAddressToAPI, ClientFromAPI, ClientQueryParamsToAPI, ClientsPageFromAPI,
    ClientToAPI, EnrichedArticleFromAPI, EnrichedArticlesPageFromAPI, EnrichedClientAddressesPageFromAPI,
    EnrichedClientAddressFromAPI,
    EnrichedClientFromAPI,
    EnrichedClientsPageFromAPI, EnrichedTaskFromAPI, EnrichedTasksPageFromAPI,
    EnrichedUserFromAPI, EnrichedUsersPageFromAPI,
    NewUserFromAPI,
    NewUserToAPI,
    RequestMethod,
    RequireLogin, ShiftFromAPI, ShiftQueryParamsToAPI, ShiftToAPI, TaskFromAPI, TasksPageFromAPI, TaskToAPI,
    UpdatedUserToAPI,
    UserFromAPI, UsersPageFromAPI
} from "../my_types"
import TimeHelper from "../helpers/TimeHelper.ts";
import UserRoleHelper from "../helpers/UserRoleHelper.ts";

export default class ShiftsAPI extends BaseAPI {

    private static instance: ShiftsAPI

    constructor() {
        // call new BaseAPI()
        super()
    }

    /**
     * (Uses singleton design pattern)
     */
    public static getInstance(): ShiftsAPI {
        if(this.instance == null) {
            this.instance = new ShiftsAPI()
        }
        return this.instance
    }


    /**
     * Enrich a pagination page.
     */
    // private enrichPage(page: TasksPageFromAPI): EnrichedTasksPageFromAPI {
    //     const enrichedItems = this.enrichItems(page.content)
    //     return {
    //         ...page,
    //         content: enrichedItems,
    //     }
    // }
    //
    // private enrichItems(items: TaskFromAPI[]): EnrichedTaskFromAPI[] {
    //     return items.map((item) => this.enrichItem(item))
    // }
    //
    // /**
    //  * Enriches an item coming from the API.
    //  */
    // private enrichItem(item: TaskFromAPI): EnrichedTaskFromAPI {
    //     return {
    //         ...item,
    //         // add custom fields to each item
    //     }
    // }


    /**
     * Add a shift.
     */
    public async addShift(shiftData: ShiftToAPI): Promise<ShiftFromAPI>
    {
        const config = APIHelper.getFetchConfigFor(RequestMethod.POST, RequireLogin.YES, shiftData)

        const endpoint = `/shifts`

        const resp: Response = await this.doFetchAt(endpoint, config)

        const data = await this.parseJSON<ShiftFromAPI>(resp)

        return data
    }

    /**
     * Find shifts.
     */
    // public async searchShifts(): Promise<ShiftFromAPI[]> {
    //     const config = APIHelper.getFetchConfigFor(RequestMethod.GET, RequireLogin.YES)
    //
    //
    //
    //     const endpoint = `/shifts`
    //
    //     const resp: Response = await this.doFetchAt(endpoint, config)
    //
    //     const data = await this.parseJSON<ShiftFromAPI[]>(resp)
    //
    //     return data
    // }


    public async findShiftsBetweenDates(startDate: string|null=null,
                                        endDate: string|null = null): Promise<ShiftFromAPI[]>
    {

        const params: ShiftQueryParamsToAPI = {}

        if(startDate) {
            params.from = startDate
        }

        if(endDate) {
            params.to = endDate
        }

        const config = APIHelper.getFetchConfigFor(RequestMethod.GET, RequireLogin.YES)

        const resp: Response = await this.doFetchAtWithParams(
            "/shifts",
            config,
            params as unknown as Record<string, string>
        )

        const data = await this.parseJSON<ShiftFromAPI[]>(resp)

        return data

    }

    /**
     *
     */
    public async findShiftsToday(): Promise<ShiftFromAPI[]>
    {

        const today = TimeHelper.today();

        return this.findShiftsBetweenDates(today, today);

    }

    /**
     *
     */
    public async findShiftsThisWeek(): Promise<ShiftFromAPI[]>
    {

        const monday = TimeHelper.startOfWeek();
        const sunday = TimeHelper.endOfWeek()

        return this.findShiftsBetweenDates(monday, sunday);

    }

    // findShiftsByOperator(operator): list of shifts
    //
    // findShiftsByOperatorBetween(operator, stard date, end date): list of shifts
    //
    // findOperatorsBetween(start date, end date): list of operators
    //
    // findOperatorsWithoutShiftsBetween(start date, end date): list of operators


}
