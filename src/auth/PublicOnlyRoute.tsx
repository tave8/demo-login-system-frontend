import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext"
import { AppRoutes } from "../js/my_types"

/**
 * Wrapper for components/routes that must not be protected by login.
 * Therefore, the user must NOT be logged in, to access this component/route.
 * For example, the signup and login components themselves.
 * They can be accessed, only if the user is not logged in.
 */
export function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { authenticated,getUserFromLocalStorage } = useAuth()

  const user = getUserFromLocalStorage()

  // if the user is not logged in, they can access the component
  // otherwise they are redirected to dashboard page
  if(user == null) {
     return children
  }
  if(!authenticated) {
    return children
  }
  // user is logged in, so redirect them to their dashboard
  return <Navigate to={AppRoutes.dashboardOf(user.role)} />
}
