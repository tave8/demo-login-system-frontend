import {NavigateFunction, useNavigate} from "react-router-dom";
import {useState} from "react";
import {useAuth} from "../../auth/AuthContext.tsx";
import {Nav, NavDropdown} from "react-bootstrap";
import AppNotificationBell from "../AppNotificationBell.tsx";
import {AppEvent, AppEventMessageType, AppRoutes} from "../../js/my_types.ts";
import AppEventDispatcher from "../../js/AppEventDispatcher.ts";

const appEventDispatcher: AppEventDispatcher = AppEventDispatcher.getInstance()


interface handleLogoutParams {
    login: (token: string) => void
    logout: () => void
    authenticated: boolean
    navigate: NavigateFunction
}


export default function AppNavContentSettings() {

    const navigate = useNavigate()
    const [navExpanded, setNavExpanded] = useState(false);

    const { login, logout, authenticated } = useAuth()

    const closeNav = () => setNavExpanded(false);

    return (
        <>
            {/* settings */}
            {authenticated && (
                <Nav className="align-items-center">
                    {/* notifications */}
                    <Nav.Item>
                        <AppNotificationBell  />
                    </Nav.Item>

                    <NavDropdown title="Impostazioni" id="basic-nav-dropdown" align="end">
                        {/* my profile */}
                        <NavDropdown.Item
                            onClick={() => {
                                navigate(AppRoutes.myProfile)
                                closeNav()
                            }
                            }>
                            Il mio profilo
                        </NavDropdown.Item>

                        {/* divider */}
                        <NavDropdown.Divider />

                        {/* logout */}
                        <NavDropdown.Item
                            onClick={() => {
                                handleLogout()({ login, logout, authenticated, navigate });
                                closeNav()
                            }}>
                            Logout
                        </NavDropdown.Item>
                    </NavDropdown>

                </Nav>
            )}
        </>
    )
}



const handleLogout = () => {
    return (params: handleLogoutParams) => {
        const { login, logout, authenticated, navigate } = params

        logout()
        navigate(AppRoutes.loginOperator)

        appEventDispatcher.dispatchStandard(
            AppEvent.APP_SUCCESS,
            AppEventMessageType.LOGOUT_SUCCESS
        )

    }
}