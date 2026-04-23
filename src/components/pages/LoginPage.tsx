import { Component } from "react"
import { Container, Row, Col, Nav, Navbar, NavDropdown, Image, Dropdown, Form, InputGroup, Button } from "react-bootstrap"
import { Search, BellFill } from "react-bootstrap-icons"
import { Link } from "react-router-dom"

const LoginPage = () => {
  return (
    <>
      <Container fluid>
        <Row className="d-flex justify-content-center">
          <Col xs={12} md={6} lg={4}>
            {/* title */}
            <Row>
              <Col>
                <h1 className="text-center">Login</h1>
              </Col>
            </Row>
            {/* email */}
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="name@example.com" />
                </Form.Group>
              </Col>
            </Row>
            {/* password */}
            <Col>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Your password" />
              </Form.Group>
            </Col>
            {/* submit */}
            <Col className="text-center">
              <Button variant="primary">Login</Button>
            </Col>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default LoginPage
