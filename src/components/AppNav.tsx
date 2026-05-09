import {Component, useState} from "react"
import { Container, Row, Col, Nav, Navbar, NavDropdown, Image, Dropdown } from "react-bootstrap"
import { Search, BellFill } from "react-bootstrap-icons"
import { Link, useNavigate, NavigateFunction } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"
import {AppEvent, AppEventMessage, AppEventMessageType, AppRoutes} from "../js/my_types"
import AppEventDispatcher from "../js/AppEventDispatcher.ts";
import AppNotificationBell from "./AppNotificationBell.tsx";
import AppNavContentAuth from "./AppNavContentAuth.tsx";
import AppNavContentSettings from "./AppNavContentSettings.tsx";

const appEventDispatcher: AppEventDispatcher = AppEventDispatcher.getInstance()



const MyNav = () => {
  const navigate = useNavigate()
  const [navExpanded, setNavExpanded] = useState(false);

  const { login, logout, authenticated } = useAuth()

  const closeNav = () => setNavExpanded(false);

  return (
      <Navbar
          expand="lg"
          expanded={navExpanded}
          onToggle={(expanded) => setNavExpanded(expanded)}
          className="bg-body-tertiary">
        <Container fluid>
          <Link
              to={AppRoutes.dashboard}
              onClick={closeNav}
              className="nav-item navbar-brand">
            Operavion CRM
          </Link>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">

            <Nav className="me-auto">



              {authenticated && (
                  <Link
                      to={AppRoutes.dashboard}
                      onClick={closeNav}
                      className="nav-item nav-link">
                    Oggi
                  </Link>
              )}

              {authenticated && (
                  <Link
                      to={AppRoutes.myArticles}
                      onClick={closeNav}
                      className="nav-item nav-link">
                    Turni
                  </Link>
              )}

              {authenticated && (
                  <Link
                      to={AppRoutes.addMyArticle}
                      onClick={closeNav}
                      className="nav-item nav-link">
                    Clienti
                  </Link>
              )}

              {authenticated && (
                  <Link
                      to={AppRoutes.uploadCV}
                      onClick={closeNav}
                      className="nav-item nav-link">
                    Team
                  </Link>
              )}

              {authenticated && (
                  <Link
                      to={AppRoutes.uploadCV}
                      onClick={closeNav}
                      className="nav-item nav-link">
                    Attività
                  </Link>
              )}

              {authenticated && (
                  <Link
                      to={AppRoutes.uploadCV}
                      onClick={closeNav}
                      className="nav-item nav-link">
                    Report
                  </Link>
              )}

            </Nav>

            {/* login & signup */}
            <AppNavContentAuth />


            {/* user settings */}
            <AppNavContentSettings />


          </Navbar.Collapse>
        </Container>
      </Navbar>
  )
}



export default MyNav
