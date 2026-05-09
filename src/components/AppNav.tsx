import {Component, useState} from "react"
import { Container, Row, Col, Nav, Navbar, NavDropdown, Image, Dropdown } from "react-bootstrap"
import { Search, BellFill } from "react-bootstrap-icons"
import { Link, useNavigate, NavigateFunction } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"
import {AppEvent, AppEventMessage, AppEventMessageType, AppRoutes} from "../js/my_types"
import AppEventDispatcher from "../js/AppEventDispatcher.ts";
import AppNotificationBell from "./AppNotificationBell.tsx";
import NavContentAuth from "./navbar/NavContentAuth.tsx";
import NavContentSettings from "./navbar/NavContentSettings.tsx";
import NavContentForAdmin from "./navbar/NavContentForAdmin.tsx";
import NavContentForOperator from "./navbar/NavContentForOperator.tsx";

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

            {/* for admin */}
            <NavContentForAdmin />

            {/* for coordinator */}
            {/* ..add here.. */}

            {/* for operator */}
            <NavContentForOperator />


            {/* user settings */}
            <NavContentSettings />

            {/* login & signup */}
            <NavContentAuth />

          </Navbar.Collapse>
        </Container>
      </Navbar>
  )
}



export default MyNav
