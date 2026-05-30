import {useEffect} from "react";
import {AppEvent, AppEventMessageType, AppRoutes} from "../js/my_types.ts";
import AppEventDispatcher from "../js/AppEventDispatcher.ts";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../auth/AuthContext.tsx";
import QrCodeAPI from "../js/api/QrCodeAPI.ts";
import UnauthorizedError from "../js/exceptions/UnauthorizedError.ts";

const qrCodeAPI = QrCodeAPI.getInstance()
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
export default function ShortcutPage() {

    const { authenticated, getUserFromLocalStorage } = useAuth()

    const user = getUserFromLocalStorage()

    const navigate = useNavigate()

    useEffect(() => {

        const params = new URLSearchParams(window.location.search);
        // the "for" query param
        const forParam = params.get("for");

        // if there's no for param
        if (!forParam) {
            appEventDispatcher.dispatch(
                AppEvent.APP_ERROR,
                `Route shortcut was provided without 'for' query param `
                +`and thus cannot be resolved. Thus, you've been `
                + `redirected to login page (or wherever that led to).`
            )
            navigate(AppRoutes.login)
            return
        }

        // route based on "for" param
        switch (forParam) {

            case "emailverification.success":
                appEventDispatcher.dispatchStandard(
                    AppEvent.APP_SUCCESS,
                    AppEventMessageType.EMAIL_VERIFICATION_SUCCESS
                );
                navigate(AppRoutes.login);
                break;

            case "emailverification.invalid":
                appEventDispatcher.dispatchStandard(
                    AppEvent.APP_ERROR,
                    AppEventMessageType.EMAIL_VERIFICATION_INVALID
                );
                navigate(AppRoutes.login);
                break;

            case "dashboard":
                navigate(AppRoutes.dashboard);
                break;


            case "operator.shift.start":

                // if the token query param is missing
                const token = params.get("token");

                if(!token) {
                    appEventDispatcher.dispatch(
                        AppEvent.APP_ERROR,
                        `Missing 'token' query param for shortcut 'operator.shift.start'.`
                    )
                    navigate(AppRoutes.login);
                    return
                }

                qrCodeAPI
                    .verify(token)
                    .then((_) => {
                        appEventDispatcher.dispatch(
                            AppEvent.APP_SUCCESS,
                            `Codice QR valido.`
                        )
                    })
                    .catch((err: Error) => {
                        if(err instanceof UnauthorizedError) {

                            appEventDispatcher.dispatch(
                                AppEvent.APP_ERROR,
                                `Il codice QR non è valido.`
                            )

                        }
                    })

                // verify that the token is valid

                // appEventDispatcher.dispatch(
                //     AppEvent.APP_SUCCESS,
                //     "hello, gotta start your shift?"
                // );

                // navigate(AppRoutes.dashboard);
                break;

            // add more cases here...


            //  invalid or not recognized shortcut
            default:
                appEventDispatcher.dispatch(
                    AppEvent.APP_ERROR,
                    `Route shortcut '${forParam}' was invalid or not recognized. Did you mean something else?`
                )
                navigate(AppRoutes.login);
                break;
        }



    }, []);


        return (
            <div style={{
                position: "fixed",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
                gap: "1.2rem"
            }}>
                <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .qr-spinner {
                    width: 48px;
                    height: 48px;
                    border: 3px solid #e5e7eb;
                    border-top-color: #111;
                    border-radius: 50%;
                    animation: spin 0.75s linear infinite;
                }
            `}</style>

                <div className="qr-spinner" />

                <span style={{
                    fontSize: "0.85rem",
                    color: "#9ca3af",
                    letterSpacing: "0.05em",
                    fontFamily: "monospace"
                }}>
                un attimo...
            </span>
            </div>
        );
}