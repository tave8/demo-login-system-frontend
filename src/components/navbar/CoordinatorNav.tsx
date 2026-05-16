import {Link, useNavigate} from "react-router-dom";
import {AppRoutes, UserRole} from "../../js/my_types.ts";
import {useEffect, useState} from "react";
import {useAuth} from "../../auth/AuthContext.tsx";
import {Nav, NavDropdown} from "react-bootstrap";

interface Props {
    setNavExpanded: (x: boolean) => void
}

export default function CoordinatorNav({ setNavExpanded }: Props) {
    const navigate = useNavigate()

    const { login, logout, authenticated, user } = useAuth()

    const closeNav = () => setNavExpanded(false);


    return (
        <>
            {/* if the role of this user is admin, show this */}

            {authenticated && user && (user.role == UserRole.COORDINATOR) && (

                <Nav className="me-auto">

                        {/*<Link*/}
                        {/*    to={AppRoutes.dashboard}*/}
                        {/*    onClick={closeNav}*/}
                        {/*    className="nav-item nav-link">*/}
                        {/*    Oggi*/}
                        {/*</Link>*/}

                        {/*<Link*/}
                        {/*    to={AppRoutes.myArticles}*/}
                        {/*    onClick={closeNav}*/}
                        {/*    className="nav-item nav-link">*/}
                        {/*    Turni*/}
                        {/*</Link>*/}

                        {/*<Link*/}
                        {/*    to={AppRoutes.addMyArticle}*/}
                        {/*    onClick={closeNav}*/}
                        {/*    className="nav-item nav-link">*/}
                        {/*    Clienti*/}
                        {/*</Link>*/}

                        <NavDropdown title="(TODO)" id="basic-nav-dropdown" align="end">
                            {/* add user */}
                            {/*<NavDropdown.Item*/}
                            {/*    onClick={() => {*/}
                            {/*        navigate(AppRoutes.users)*/}
                            {/*        closeNav()*/}
                            {/*    }*/}
                            {/*    }>*/}
                            {/*    Il mio Team*/}
                            {/*</NavDropdown.Item>*/}

                            {/* divider */}
                            <NavDropdown.Divider />

                            {/* see users */}
                            {/*<NavDropdown.Item*/}
                            {/*    onClick={() => {*/}
                            {/*        navigate(AppRoutes.addUser)*/}
                            {/*        closeNav()*/}
                            {/*    }}>*/}
                            {/*    Aggiungi utente*/}
                            {/*</NavDropdown.Item>*/}
                        </NavDropdown>


                        {/*<Link*/}
                        {/*    to={AppRoutes.uploadCV}*/}
                        {/*    onClick={closeNav}*/}
                        {/*    className="nav-item nav-link">*/}
                        {/*    Attività*/}
                        {/*</Link>*/}

                        {/*<Link*/}
                        {/*    to={AppRoutes.uploadCV}*/}
                        {/*    onClick={closeNav}*/}
                        {/*    className="nav-item nav-link">*/}
                        {/*    Report*/}
                        {/*</Link>*/}

                </Nav>


            )}

        </>
    )
}