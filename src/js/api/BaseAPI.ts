import APIHelper from "./APIHelper.ts";
import NetworkError from "../exceptions/NetworkError.ts";
import ExpectedJSONPayloadError from "../exceptions/ExpectedJSONPayloadError.ts";
import ShouldLogoutError from "../exceptions/ShouldLogoutError.ts";
import AppEventDispatcher from "../AppEventDispatcher.ts";
import {AppEvent} from "../my_types.ts";

export default abstract class BaseAPI {

    // dependency
    private readonly appEventDispatcher: AppEventDispatcher = AppEventDispatcher.getInstance()

    /**
     * Use this when you want automatic, app-specific
     * error management, without having to handle
     * all error cases manually.
     * For example, if a network error occurs,
     * you want to show a toast message, without having
     * to repeat this logic in every API call.
     *
     * Do an API call at the specific endpoint,
     * with built-in error handling.
     * The error gets re-thrown.
     *
     * Because this is a
     *
     * @param relativeURLPath
     * @param config
     */
    public async doFetchAt(relativeURLPath: string,
                           config: RequestInit): Promise<Response>
    {

        return await APIHelper.doFetchAtButIfError(relativeURLPath, config, (err: Error) => {
            console.error(err)

            // app-specific actions to be triggered when
            // an error is thrown
            if(err instanceof NetworkError) {
                // console.log("NETWORK ERROR!")

                this.appEventDispatcher.dispatch(
                    AppEvent.APP_ERROR,
                    "There was a network error. Please check your connection."
                )

            }

            // handle other errors here...

        })

    }


    /**
     *
     *
     * @param resp
     */
    public async parseJSON<T_FROM_API>(resp: Response): Promise<T_FROM_API>
    {

        return await APIHelper.parseJSONButIfError(resp, (err: Error)=> {
            console.error(err)

            if(err instanceof ExpectedJSONPayloadError) {

                this.appEventDispatcher.dispatch(
                    AppEvent.APP_ERROR,
                    "Internal error (expected JSON payload)"
                )

            } else if (err instanceof ShouldLogoutError) {

            }

            // handle other errors here...

        })

    }

}
