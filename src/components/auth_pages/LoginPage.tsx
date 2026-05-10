import {useState} from "react"
import {Button, Col, Container, Form, Row} from "react-bootstrap"
import {
  AppEvent,
  AppEventMessage,
  AppEventMessageType,
  AppRoutes,
  type LoginToAPI,
  UserFromAPI
} from "../../js/my_types"
import AuthAPI from "../../js/api/AuthAPI"
import {useAuth} from "../../auth/AuthContext"
import {Link, NavigateFunction, useNavigate} from "react-router-dom"
import UnauthorizedError from "../../js/exceptions/UnauthorizedError"
import ForbiddenError from "../../js/exceptions/ForbiddenError.ts";
import AppEventDispatcher from "../../js/AppEventDispatcher.ts";

const appEventDispatcher: AppEventDispatcher = AppEventDispatcher.getInstance()

interface handleLoginParams {
  setIsLoading: (x:boolean) => void
  setIsError: (x:boolean) => void
  login: (token: string, user: UserFromAPI) => void
  logout: () => void
  authenticated: boolean
  navigate: NavigateFunction,
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
            <Row className={"mb-3"}>
              <Col>
                <h1 className="text-center">Entra - Area Manager</h1>
              </Col>
            </Row>

            <Row>
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
                        placeholder="nome.cognome@gmail.com"
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
                      placeholder="La mia password"
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
                    Entra
                  </Button>
                </Col>
              </Form>
            </Row>

            {/* forgot password */}
            <Col className="text-center mt-3">
              <Link
                  to={AppRoutes.forgotPasswordProvideEmail}
              >
                Dimenticato password?
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

        login(accessToken, loginInfo.user)

        // after successful login, where route the user
        // is redirected to
        navigate(AppRoutes.dashboardOf(loginInfo.user.role))

        appEventDispatcher.dispatchStandard(
            AppEvent.APP_SUCCESS,
            AppEventMessageType.LOGIN_SUCCESS
        )

      })
      .catch((err) => {

        setIsLoading(false)
        setIsError(true)

        if (err instanceof UnauthorizedError) {

          appEventDispatcher.dispatchStandard(
              AppEvent.APP_ERROR,
              AppEventMessageType.WRONG_CREDENTIALS
          )

        } else if (err instanceof ForbiddenError) {

          appEventDispatcher.dispatchStandard(
              AppEvent.APP_ERROR,
              AppEventMessageType.MUST_VERIFY_EMAIL
          )

        }
      })
  }

}

export default LoginPage
