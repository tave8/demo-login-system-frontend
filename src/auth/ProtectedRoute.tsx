import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext"
import {AppRoutes, UserRole} from "../js/my_types"

interface Params {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

/**
 * Wrapper for components/routes that must be protected by login.
 * Therefore, the user must be logged in, to access this component/route.
 */
export function ProtectedRoute({ children, allowedRoles=[] }: Params) {
  const { authenticated, getUser } = useAuth()

  const user = getUser()

  // if user is not authenticated,
  if (!authenticated) {
    return <Navigate to={AppRoutes.login} />
  }

  // if for some reason, current user was not saved
  if (user == null) {
    return <Navigate to={AppRoutes.login} />
  }

  // if current user is in the list of allowed roles
  if(allowedRoles.includes(user.role)) {
    // access the resource
    return children
  }

  // current user is not authorized
  return <Navigate to={AppRoutes.unauthorized} />

}
