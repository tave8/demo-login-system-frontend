import { createContext, useContext, useState } from "react";
import { isLoggedIn } from "./isLoggedIn";

interface AuthContextType {
    authenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

/**
 * AuthContext gives us a global "authentication state" that any component can read or modify.
 * It works in three parts:
 *
 * 1. AuthProvider: a wrapper component that holds the actual state (authenticated true/false)
 *    and the login/logout functions. We wrap the entire app with it in main.tsx so every
 *    component inside has read/write functionality on the AuthContext inner state.
 *
 * 2. useAuth: a custom hook that lets any component read the auth state and call login/logout.
 *    Instead of passing props down manually, any component just calls useAuth() and gets
 *    everything it needs.
 *
 * 3. login(token) / logout(): the only two ways to change the auth state.
 *    login() saves the token to localStorage and sets authenticated = true.
 *    logout() removes the token from localStorage and sets authenticated = false.
 */
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authenticated, setAuthenticated] = useState<boolean>(isLoggedIn);

    const login = (token: string) => {
        localStorage.setItem("token", token);
        setAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ authenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
};