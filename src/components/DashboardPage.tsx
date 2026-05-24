import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../auth/AuthContext.tsx";
import {AppRoutes} from "../js/my_types.ts";

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