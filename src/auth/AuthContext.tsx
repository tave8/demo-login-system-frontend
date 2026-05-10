import {createContext, useContext, useState} from "react";
import {isLoggedIn} from "./isLoggedIn";
import {AppEvent, UserFromAPI} from "../js/my_types.ts";
import AppEventDispatcher from "../js/AppEventDispatcher.ts";

const appEventDispatcher = AppEventDispatcher.getInstance()

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
    getUser: () => UserFromAPI | null
    // set user in local sorage
    setUser: (user: UserFromAPI) => void
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

export function AuthProvider({ children }: { children: React.ReactNode })
{

    const [authenticated, setAuthenticated] = useState<boolean>(isLoggedIn);

    /**
     * Get user from local storage.
     */
    const getUser = () => {
        // get user from local storage
        const userAsStr = localStorage.getItem("user")

        // no user in local storage (no key)
        if (userAsStr == null) {
            return null
        }

        // error while parsing JSON from local storage
        try {

            const user: UserFromAPI = JSON.parse(userAsStr)

            return user

        } catch (err) {

            appEventDispatcher.dispatch(
                AppEvent.APP_ERROR,
                "Error while getting user from local storage, specifically while "
                +"parsing it from string to JSON. DETAILS: " + String(err)
            )

            // re-throw error
            throw err

        }
    }

    /**
     * Set user in local storage.
     * Override current one in local storage, if there's one.
     */
    const setUser = (user: UserFromAPI) => {
        localStorage.setItem("user", JSON.stringify(user))
    }

    const login = (token: string, user: UserFromAPI) => {
        localStorage.setItem("token", token);
        setUser(user)
        setAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user")
        setAuthenticated(false);
    };

    return (
        // these "props" will be "passed down"
        <AuthContext.Provider value={{ authenticated, login, logout, getUser, setUser }}>
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