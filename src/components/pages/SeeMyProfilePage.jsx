import { Component } from "react"
import { Container, Row, Col, Nav, Navbar, NavDropdown, Image, Dropdown, Form, InputGroup, Button } from "react-bootstrap"
import { Search, BellFill } from "react-bootstrap-icons"
import { Link } from "react-router-dom"

const SeeMyProfilePage = () => {
  return (
    <>
      <Container fluid>
        <Row className="d-flex justify-content-center">
          <Col xs={12} md={6} lg={4}>
            {/* title */}
            <Row>
              <Col>
                <h1 className="text-center">My profile</h1>
              </Col>
            </Row>
            {/* my profile info */}
            <Row>
              <Col>
                <p>my profile info is here</p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default SeeMyProfilePage
