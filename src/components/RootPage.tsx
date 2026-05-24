import {useEffect} from "react";
import {AppEvent, AppEventMessageType, AppRoutes} from "../js/my_types.ts";
import AppEventDispatcher from "../js/AppEventDispatcher.ts";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../auth/AuthContext.tsx";

const appEventDispatcher = AppEventDispatcher.getInstance()

/**
 * Why this component?
 * Logic: the backend must not care about what page does what.
 * The backend only cares about the message.
 * Backend should only care about sending something like "/?emailVerificationSuccess=true"
 * and should not know about the specific page/route.
 *
 * So frontend is responsible for re-routing.
 *
 * For example, backend is now free to do something like:
 *
 *      appEnvironment.buildFrontendUrl("/?emailVerificationSuccess=true")
 *
 * and frontend re-routes to the actual page/route.
 *
 */
export default function RootPage() {

    const { authenticated, getUserFromLocalStorage } = useAuth()

    const user = getUserFromLocalStorage()

    const navigate = useNavigate()

    useEffect(() => {

        // if user is logged in, re-route to dashboard
        // if(authenticated) {
        //
        //     navigate(AppRoutes.dashboard)
        //     return
        // }

        // check that query param contains emailVerificationSuccess=true,
        // if yes, we show the user a toast saying that
        // they've verified their email
        const params = new URLSearchParams(window.location.search);
        const emailVerified = params.get("emailVerificationSuccess");

        // email verification: success
        if (emailVerified === "true") {

            appEventDispatcher.dispatchStandard(
                AppEvent.APP_SUCCESS,
                AppEventMessageType.EMAIL_VERIFICATION_SUCCESS
            )

            navigate(AppRoutes.login)

        }
        // email verification: failed
        else if (emailVerified === "false") {

            navigate(AppRoutes.invalidEmailVerification)

        }
        // don't know what to do
        else {

            navigate(AppRoutes.login)

        }

        // handle more cases here..


    }, []);

    return (<></>)
}