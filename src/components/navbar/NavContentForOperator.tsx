import {Link, useNavigate} from "react-router-dom";
import {AppRoutes, UserRole} from "../../js/my_types.ts";
import {useState} from "react";
import {useAuth} from "../../auth/AuthContext.tsx";
import {Nav} from "react-bootstrap";

export default function NavContentForOperator() {
    const navigate = useNavigate()
    const [navExpanded, setNavExpanded] = useState(false);

    const { login, logout, authenticated, getUser } = useAuth()

    const closeNav = () => setNavExpanded(false);


    return (
        <>

            {authenticated && getUser().role == UserRole.OPERATOR && (

                <Nav className="me-auto">

                    {authenticated && (
                        <Link
                            to={AppRoutes.dashboard}
                            onClick={closeNav}
                            className="nav-item nav-link">
                            I miei turni
                        </Link>
                    )}

                </Nav>

            )}

        </>
    )
}