import {NavigateFunction, useNavigate} from "react-router-dom";
import {useAuth} from "../../auth/AuthContext.tsx";
import {Nav, NavDropdown} from "react-bootstrap";
import AppNotificationBell from "../AppNotificationBell.tsx";
import {AppEvent, AppEventMessageType, AppRoutes, UserRole} from "../../js/my_types.ts";
import AppEventDispatcher from "../../js/AppEventDispatcher.ts";
import {QuestionCircle, Whatsapp} from "react-bootstrap-icons";
import WhatsappHelper from "../../js/helpers/WhatsappHelper.ts";

const appEventDispatcher: AppEventDispatcher = AppEventDispatcher.getInstance()

interface Props {
    setNavExpanded: (x: boolean) => void
}

interface handleLogoutParams {
    logout: () => void
    authenticated: boolean
    navigate: NavigateFunction
}


export default function NavSettings({ setNavExpanded }: Props) {

    const navigate = useNavigate()

    const { login, logout, authenticated, user } = useAuth()

    const closeNav = () => setNavExpanded(false);

    const whatsappHelp = WhatsappHelper.askMeHelp()


    return (
        <>
            {/* settings */}
            {authenticated && (
                <Nav className="align-items-center">

                    {/* support */}
                    <Nav.Item>
                            <div style={{
                            }}>
                                <a
                                    href={whatsappHelp}
                                    target="_blank"
                                    rel="noreferrer">
                                    <Whatsapp
                                        size={20}
                                        color="#25D366" />
                                </a>
                            </div>
                    </Nav.Item>

                    {/* notifications */}
                    <Nav.Item>
                        <AppNotificationBell  />
                    </Nav.Item>


                    <NavDropdown title="Impostazioni" id="basic-nav-dropdown" align="end">

                        {/* operators cannot see their profile */}
                        {user && user.role != UserRole.OPERATOR && (
                            <>
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
                            </>
                        )}


                        {/* logout */}
                        <NavDropdown.Item
                            onClick={() => {
                                handleLogout()({ logout, authenticated, navigate });
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
        const { logout, authenticated, navigate } = params

        logout()
        navigate(AppRoutes.loginOperator)

        appEventDispatcher.dispatchStandard(
            AppEvent.APP_SUCCESS,
            AppEventMessageType.LOGOUT_SUCCESS
        )

    }
}