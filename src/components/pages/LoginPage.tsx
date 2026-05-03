import { useState } from "react"
import { Container, Row, Col, Form, Button } from "react-bootstrap"
import { AppRoutes, type LoginToAPI } from "../../js/my_types"
import AuthAPI from "../../js/api/AuthAPI"
import { useAuth } from "../../auth/AuthContext"
import {useNavigate, NavigateFunction, Link} from "react-router-dom"
import UnauthorizedError from "../../js/exceptions/UnauthorizedError"
import ForbiddenError from "../../js/exceptions/ForbiddenError.ts";

interface handleLoginParams {
  setIsLoading: (x:boolean) => void
  setIsError: (x:boolean) => void
  login: (token: string) => void
  logout: () => void
  authenticated: boolean
  navigate: NavigateFunction
}

const initialFormValues: LoginToAPI = {
  email: "",
  password: "",
}

const LoginPage = () => {
  const [formValues, setFormValues] = useState(initialFormValues)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

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

            {/* form */}
            <Form onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin(formValues)({ login, logout, authenticated, navigate, setIsError, setIsLoading });
                }
              }}>
              {/* email */}
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      disabled={isLoading}
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
                    disabled={isLoading}
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
                  disabled={isLoading}
                  variant="primary"
                  onClick={() => {
                    handleLogin(formValues)({ login, logout, authenticated, navigate, setIsError, setIsLoading })
                  }}
                >
                  Login
                </Button>
              </Col>
            </Form>

            {/* forgot password */}
            <Col className="text-center mt-3">
              <Link
                  to={AppRoutes.forgotPasswordProvideEmail}
              >
                Forgot password?
              </Link>
            </Col>
          </Col>
        </Row>
      </Container>
    </>
  )
}

const handleLogin = (formValues: LoginToAPI) => {
  return async (params: handleLoginParams) => {
    const { login, logout, authenticated, navigate, setIsError, setIsLoading } = params

    const authAPI = new AuthAPI()

    setIsLoading(true)
    setIsError(false)

    authAPI
      .login(formValues)
      .then((loginInfo) => {

        setIsLoading(false)
        setIsError(false)

        const { accessToken } = loginInfo
        login(accessToken)
        // after successful login, where route the user
        // is redirected to
        navigate(AppRoutes.dashboard)
        // console.log(loginInfo)
        window.dispatchEvent(
            new CustomEvent("login-success", {
              detail: "Successful login"
            })
        )
      })
      .catch((err) => {

        setIsLoading(false)
        setIsError(true)

        if (err instanceof UnauthorizedError) {
          alert("Wrong credentials.")
        } else if (err instanceof ForbiddenError) {
          alert("You need to verify your email first. "
              +"We've just sent you a unique verification link in your inbox.")
        } else {
          console.info("Error during login")
          console.error(err)
        }
      })
  }

}

export default LoginPage
