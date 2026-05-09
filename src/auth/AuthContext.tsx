import { createContext, useContext, useState } from "react";
import { isLoggedIn } from "./isLoggedIn";
import {UserFromAPI} from "../js/my_types.ts";

/**
 * This interface represents the
 * properties that will be accessible
 * by invoking the useAuth() hook.
 */
interface AuthContextType {
    authenticated: boolean;
    login: (token: string, user: UserFromAPI) => void;
    logout: () => void;
    // get user from local storage
    getUser: () => UserFromAPI
    // get user from local storage, only if they're authenticated,
    // if not,
    // getUserIfAuthenticated: () => UserFromAPI
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

    /**
     * Get user from local storage.
     */
    const getUser = () => {
        // get user from local storage
        const userAsStr = localStorage.getItem("user")

        if (userAsStr == null) {
            return {

            }
            // throw new Error("There's no user in local storage.")
        }

        // check for parsing error
        const user: UserFromAPI = JSON.parse(userAsStr)

        return user
    }


    const login = (token: string, user: UserFromAPI) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user))
        setAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user")
        setAuthenticated(false);
    };

    return (
        // these "props" will be "passed down"
        <AuthContext.Provider value={{ authenticated, login, logout, getUser }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * This hook will be globally accessible in the app,
 * and by calling it, it  will provide access to
 * the properties specified in AuthContextType interface.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
};