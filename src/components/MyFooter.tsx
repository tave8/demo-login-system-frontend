import { Component } from "react"
import { Container, Row, Col, Nav, Navbar, NavDropdown, Image, Dropdown } from "react-bootstrap"
import { Search, BellFill } from "react-bootstrap-icons"
import { Link } from "react-router-dom"

const MyFooter = () => {
  return (
    <Container fluid className="bg-body-tertiary">
      <Row className="justify-content-center align-items-center">
        <Col className="text-center">
          <p className="my-3">Demo Login System - {new Date().getFullYear()}</p>
        </Col>
      </Row>
    </Container>
  )
}

export default MyFooter
