

import APIHelper from "./APIHelper"
import BaseAPI from "./BaseAPI"
import FileHelper from "../helpers/FileHelper"
import {
    EnrichedClientFromAPI,
    EnrichedClientsPageFromAPI,
    EnrichedUserFromAPI, EnrichedUsersPageFromAPI,
    NewUserFromAPI,
    NewUserToAPI,
    RequestMethod,
    RequireLogin, ShiftsCountByOperatorReportParamsToAPI,
    UpdatedUserToAPI,
    UserFromAPI, UsersPageFromAPI
} from "../my_types"
import TimeHelper from "../helpers/TimeHelper.ts";
import UserRoleHelper from "../helpers/UserRoleHelper.ts";
import {replace} from "react-router-dom";

export default class ReportsAPI extends BaseAPI {

    private static instance: ReportsAPI

    constructor() {
        // call new BaseAPI()
        super()
    }

    /**
     * (Uses singleton design pattern)
     */
    public static getInstance(): ReportsAPI {
        if(this.instance == null) {
            this.instance = new ReportsAPI()
        }
        return this.instance
    }



    /**
     * Generate report: shifts count by operator.
     */
    public async generateShiftsCountByOperator(params: ShiftsCountByOperatorReportParamsToAPI): Promise<Blob> {
        const config = APIHelper.getFetchConfigFor(RequestMethod.POST, RequireLogin.YES, params)

        const endpoint = "/export/shifts-count-by-operator/csv"

        const resp: Response = await this.doFetchAt(endpoint, config)

        // const blob = await this.parseBlob(resp)

        const blob = await resp.blob()

        return blob

    }



}
