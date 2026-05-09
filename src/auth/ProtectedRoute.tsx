import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext"
import {AppRoutes, UserRole} from "../js/my_types"
import UserRoleHelper from "../js/helpers/UserRoleHelper.ts";

interface Params {
  children: React.ReactNode
  allowOnlyRoles?: UserRole[]
  excludeOnlyRoles?: UserRole[]
  allowAllRolesExcept?: UserRole[]
}

/**
 * Wrapper for components/routes that must be protected by login.
 * Therefore, the user must be logged in, to access this component/route.
 */
export function ProtectedRoute({ children, allowOnlyRoles=[], excludeOnlyRoles=[], allowAllRolesExcept=[] }: Params) {
  const { authenticated, getUser } = useAuth()

  const user = getUser()

  // if for some reason, current user was not saved
  if (user == null) {
    return <Navigate to={AppRoutes.login} />
  }

  // if any role overlaps, it cannot be
  if(UserRoleHelper.sameRoleOverlaps(user.role, allowOnlyRoles, excludeOnlyRoles)) {
    throw new Error(`While validating user role, the role '${user.role}' `
        +`was found in both allowRoles and excludeRoles. `
        +`These lists must be mutually exclusive.`)
  }

  // if user is not authenticated,
  if (!authenticated) {
    return <Navigate to={AppRoutes.login} />
  }

  // if allowAllRolesExcept is specified, allow everyone except those roles
  if(allowAllRolesExcept.length > 0) {
    // exclude the user if it's specified to be excluded
    if(allowAllRolesExcept.includes(user.role)) {
      return <Navigate to={AppRoutes.unauthorized} />
    }
    // access the resource if user is not specified to be excluded
    return children
  }

  // if the current user is in the list of excluded roles
  if(excludeOnlyRoles.includes(user.role)) {
    return <Navigate to={AppRoutes.unauthorized} />
  }

  // if current user is not in the list of allowed roles
  if(!allowOnlyRoles.includes(user.role)) {
    // current user is not authorized
    return <Navigate to={AppRoutes.unauthorized} />
  }

  // access the resource
  return children

}