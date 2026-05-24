import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../auth/AuthContext.tsx";
import {AppEvent, AppEventMessageType, AppRoutes} from "../js/my_types.ts";
import AppEventDispatcher from "../js/AppEventDispatcher.ts";


/**
 * Use this component when the user is logged in,
 * and you want to dynamically redirect the user
 * to their dashboard.
 *
 * @constructor
 */
export default function DashboardPage() {

    const { authenticated, getUserFromLocalStorage } = useAuth()

    const user = getUserFromLocalStorage()

    const navigate = useNavigate()

    useEffect(() => {


        // redirect user to their dashboard, based on user role
        if(user) {
            navigate(AppRoutes.dashboardOf(user.role))
        }


    }, []);


    return (
        <></>
    )
}