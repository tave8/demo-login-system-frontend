import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { authenticated } = useAuth()
  return authenticated ? children : <Navigate to="/login" />
}
