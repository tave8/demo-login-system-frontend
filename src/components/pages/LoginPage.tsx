import { useState } from "react"
import { Container, Row, Col, Form, Button } from "react-bootstrap"
import type { LoginForAPI } from "../../js/my_types"
import AuthAPI from "../../js/AuthAPI"
import { useAuth } from "../../auth/AuthContext"
import { useNavigate, NavigateFunction } from "react-router-dom"

interface handleLoginParams {
  login: (token: string) => void
  logout: () => void
  authenticated: boolean
  navigate: NavigateFunction
}

const initialFormValues: LoginForAPI = {
  email: "",
  password: "",
}

const LoginPage = () => {
  const [formValues, setFormValues] = useState(initialFormValues)

  const { login, logout, authenticated } = useAuth()

  const navigate = useNavigate()

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
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    value={formValues.email}
                    onChange={(event) => {
                      setFormValues({
                        ...formValues,
                        email: event.target.value,
                      })
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            {/* password */}
            <Col>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Your password"
                  value={formValues.password}
                  onChange={(event) => {
                    setFormValues({
                      ...formValues,
                      password: event.target.value,
                    })
                  }}
                />
              </Form.Group>
            </Col>
            {/* submit */}
            <Col className="text-center">
              <Button
                variant="primary"
                onClick={() => {
                  handleLogin(formValues)({ login, logout, authenticated, navigate })
                }}
              >
                Login
              </Button>
            </Col>
          </Col>
        </Row>
      </Container>
    </>
  )
}

const handleLogin = (formValues: LoginForAPI) => {
  return async (params: handleLoginParams) => {
    const { login, logout, authenticated, navigate } = params

    // console.log("about to login")

    // if (authenticated) {
    //   logout()
    // } else {
    //   login("mytoken")
    // }

    // console.log(authenticated)

    // console.log(formValues)
    const authAPI = new AuthAPI()

    authAPI
      .login(formValues)
      .then((loginInfo) => {
        alert("successful login")
        // console.log("logged in successfully")
        const { accessToken } = loginInfo
        login(accessToken)
        navigate("/me")
        // console.log(loginInfo)
      })
      .catch((err) => {
        console.info("Error during login")
        console.error(err)
      })
  }
}

export default LoginPage
