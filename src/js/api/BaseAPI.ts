import APIHelper from "./APIHelper.ts";
import NetworkError from "../exceptions/NetworkError.ts";
import ExpectedJSONPayloadError from "../exceptions/ExpectedJSONPayloadError.ts";
import ShouldLogoutError from "../exceptions/ShouldLogoutError.ts";
import AppEventDispatcher from "../AppEventDispatcher.ts";
import {AppEvent, AppEventMessage} from "../my_types.ts";
import ServerError from "../exceptions/ServerError.ts";


/**
 * Use the methods in this parent class when you want automatic, app-specific
 * error management, without having to handle
 * all error cases manually.
 *
 * For example, if a network or server error occurs,
 * you want to show a toast message, without having
 * to repeat this logic in every API call.
 *
 * We're guaranteed that the error always gets re-thrown,
 * so we can do something more specific about it.
 * However, this layer allows us to handle common
 * error scenarios by default.
 *
 */
export default abstract class BaseAPI {

    // dependency
    private readonly appEventDispatcher: AppEventDispatcher = AppEventDispatcher.getInstance()
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
                    AppEventMessage.NETWORK_ERROR
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
                    AppEventMessage.EXPECTED_JSON_PAYLOAD
                )

            } else if (err instanceof ShouldLogoutError) {

            } else if (err instanceof ServerError) {

                this.appEventDispatcher.dispatch(
                    AppEvent.APP_ERROR,
                    AppEventMessage.SERVER_ERROR
                )

            }

            // handle other errors here...

        })

    }

}
