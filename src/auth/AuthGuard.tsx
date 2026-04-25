import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "./AuthContext"
import { isLoggedIn } from "./isLoggedIn"
import { AppRoutes } from "../js/my_types"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { authenticated, logout } = useAuth()
  const navigate = useNavigate()

  /**
   * Gets triggered at each route change.
   * Makes sure that the user is logged in
   * every time the user changes routes.
   */
  useEffect(() => {
    if (authenticated && !isLoggedIn()) {
      alert("You've been logged out")
      logout()
      navigate(AppRoutes.login)
    }
  }, [location])

  return children
}
