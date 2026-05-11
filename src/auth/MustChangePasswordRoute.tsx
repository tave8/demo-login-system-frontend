import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext"
import {AppRoutes, UserRole} from "../js/my_types"
import UserRoleHelper from "../js/helpers/UserRoleHelper.ts";

interface Params {
    children: React.ReactNode
}

/**

 */
export function MustChangePasswordRoute({ children }: Params)
{

    const { authenticated, getUserFromLocalStorage } = useAuth();

    const user = getUserFromLocalStorage()

    // if the current user does not exist,
    // go to login
    if(user == null) {
        return <Navigate to={AppRoutes.login} />
    }

    // if user is not authenticated
    if(!authenticated) {
        return <Navigate to={AppRoutes.login} />
    }

    // if user is authenticated and
    // must not change  their password
    // redirect them to an internal page (like my profile)
    // however the user might see that they're not authorized,
    // because they cannot access that page
    if (!user.mustChangePasswordNow) {
        return <Navigate to={AppRoutes.unauthorized} />
    }

    return children;

}