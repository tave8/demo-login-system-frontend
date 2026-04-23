import { Component } from "react"
import { Container, Row, Col, Nav, Navbar, NavDropdown, Image, Dropdown, Form, InputGroup, Button } from "react-bootstrap"
import { Search, BellFill } from "react-bootstrap-icons"
import { Link } from "react-router-dom"

const SignupPage = () => {
  return (
    <>
      <Container fluid>
        <Row className="d-flex justify-content-center">
          <Col xs={12} md={6} lg={4}>
            {/* title */}
            <Row>
              <Col>
                <h1 className="text-center">Sign up</h1>
              </Col>
            </Row>
            {/* firstname */}
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Firstname</Form.Label>
                  <Form.Control type="text" placeholder="My firstname" />
                </Form.Group>
              </Col>
            </Row>
            {/* lastname */}
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Lastname</Form.Label>
                  <Form.Control type="text" placeholder="My lastname" />
                </Form.Group>
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
              <Button variant="primary">Sign up</Button>
            </Col>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default SignupPage
