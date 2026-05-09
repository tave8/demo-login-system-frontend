import {Link, useNavigate} from "react-router-dom";
import {AppRoutes, UserRole} from "../../js/my_types.ts";
import {useState} from "react";
import {useAuth} from "../../auth/AuthContext.tsx";
import {Nav} from "react-bootstrap";

export default function NavContentForAdmin() {
    const navigate = useNavigate()
    const [navExpanded, setNavExpanded] = useState(false);

    const { login, logout, authenticated, getUser } = useAuth()


    const closeNav = () => setNavExpanded(false);


    return (
        <>
            {/* if the role of this user is admin, show this */}

            {authenticated && getUser().role == UserRole.ADMIN && (

                <Nav className="me-auto">

                        <Link
                            to={AppRoutes.dashboard}
                            onClick={closeNav}
                            className="nav-item nav-link">
                            Oggi
                        </Link>

                        <Link
                            to={AppRoutes.myArticles}
                            onClick={closeNav}
                            className="nav-item nav-link">
                            Turni
                        </Link>

                        <Link
                            to={AppRoutes.addMyArticle}
                            onClick={closeNav}
                            className="nav-item nav-link">
                            Clienti
                        </Link>

                        <Link
                            to={AppRoutes.uploadCV}
                            onClick={closeNav}
                            className="nav-item nav-link">
                            Team
                        </Link>

                        <Link
                            to={AppRoutes.uploadCV}
                            onClick={closeNav}
                            className="nav-item nav-link">
                            Attività
                        </Link>

                        <Link
                            to={AppRoutes.uploadCV}
                            onClick={closeNav}
                            className="nav-item nav-link">
                            Report
                        </Link>

                </Nav>


            )}

        </>
    )
}