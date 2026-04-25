import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext"
import { AppRoutes } from "../js/my_types"

/**
 * Wrapper for components/routes that must be protected by login.
 * Therefore, the user must be logged in, to access this component/route.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { authenticated } = useAuth()
  return authenticated ? children : <Navigate to={AppRoutes.login} />
}
