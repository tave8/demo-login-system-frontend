import {Component, useState} from "react"
import { Container, Row, Col, Nav, Navbar, NavDropdown, Image, Dropdown } from "react-bootstrap"
import { Search, BellFill } from "react-bootstrap-icons"
import { Link, useNavigate, NavigateFunction } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"
import {AppEvent, AppEventMessage, AppEventMessageType, AppRoutes} from "../js/my_types"
import AppEventDispatcher from "../js/AppEventDispatcher.ts";
import AppNotificationBell from "./AppNotificationBell.tsx";
import PublicNav from "./navbar/PublicNav.tsx";
import NavSettings from "./navbar/NavSettings.tsx";
import AdminNav from "./navbar/AdminNav.tsx";
import OperatorNav from "./navbar/OperatorNav.tsx";
import CoordinatorNav from "./navbar/CoordinatorNav.tsx";

const appEventDispatcher: AppEventDispatcher = AppEventDispatcher.getInstance()



const MyNav = () => {
  const navigate = useNavigate()
  const [navExpanded, setNavExpanded] = useState(false);

  const closeNav = () => setNavExpanded(false);

  const {user} = useAuth()

  return (
      <Navbar
          expand="lg"
          expanded={navExpanded}
          onToggle={(expanded) => setNavExpanded(expanded)}
          className="bg-body-tertiary">
        <Container fluid>
          <Link
              to={user ? AppRoutes.dashboardOf(user.role) : "#"}
              onClick={closeNav}
              className="nav-item navbar-brand">
            <img
                src="/logo-horizontal.png"
                alt="ZeroChiamate"
                height={22}
                style={{ marginRight: "8px" }}
            />
          </Link>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">

            {/* for admin */}
            <AdminNav setNavExpanded={setNavExpanded} />

            {/* for coordinator */}
            <CoordinatorNav setNavExpanded={setNavExpanded} />

            {/* for operator */}
            <OperatorNav setNavExpanded={setNavExpanded} />



            {/* user settings */}
            <NavSettings setNavExpanded={setNavExpanded} />

            {/* login & signup */}
            <PublicNav setNavExpanded={setNavExpanded} />

          </Navbar.Collapse>
        </Container>
      </Navbar>
  )
}



export default MyNav
