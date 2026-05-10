import {Alert, Button, Col, Container, Form, Row, Spinner} from "react-bootstrap";
import {useState} from "react";
import {
    AppEvent,
    AppEventMessageType,
    AppRoutes,
    ForgotPasswordRequestToAPI,
    ResetPasswordToAPI,
    UserFromAPI
} from "../../js/my_types.ts";
import AuthAPI from "../../js/api/AuthAPI.ts";
import UnauthorizedError from "../../js/exceptions/UnauthorizedError.ts";
import ForbiddenError from "../../js/exceptions/ForbiddenError.ts";
import {useAuth} from "../../auth/AuthContext.tsx";
import {NavigateFunction, useNavigate} from "react-router-dom";
import AppEventDispatcher from "../../js/AppEventDispatcher.ts";

const authAPI = AuthAPI.getInstance()
const appEventDispatcher = AppEventDispatcher.getInstance()

const initialData: ResetPasswordToAPI = {
    oldPassword: "",
    newPassword: ""
}

interface HandleResetPasswordParams {
    setIsLoading: (x: boolean) => void
    setIsError: (x: boolean) => void
    setUserInLocalStorage: (user: UserFromAPI) => void
    navigate: NavigateFunction
}


export default function ResetPasswordFirstLogin() {
    const [formValues, setFormValues] = useState(initialData)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    const navigate = useNavigate()

    const {setUserInLocalStorage} = useAuth()

    return (
        <>
            <Container fluid>
                <Row className="d-flex justify-content-center">
                    <Col xs={12} md={6} lg={4}>
                        {/* title */}
                        <Row className="mb-3">
                            <Col>
                                <h1 className="text-center">Imposta la tua nuova password</h1>
                            </Col>
                        </Row>

                        {/* form */}
                        <Form onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleResetPassword(formValues)({ setIsLoading, setIsError, setUserInLocalStorage, navigate })
                            }
                        }}>


                            {/* old password */}
                            <Row className="g-3">
                                <Col xs={12}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Password temporanea</Form.Label>
                                        <Form.Control
                                            type="password"
                                            disabled={isLoading}
                                            placeholder="Password temporanea"
                                            value={formValues.oldPassword}
                                            onChange={(event) => {
                                                setFormValues({
                                                    ...formValues,
                                                    oldPassword: event.target.value,
                                                })
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* new password */}
                            <Row className="g-3">
                                <Col xs={12}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Nuova password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            disabled={isLoading}
                                            placeholder="Nuova password"
                                            value={formValues.newPassword}
                                            onChange={(event) => {
                                                setFormValues({
                                                    ...formValues,
                                                    newPassword: event.target.value,
                                                })
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* submit  */}
                            <Row className="mt-2">
                                <Col xs={12} className="text-center">
                                    <Button
                                        className="btn btn-primary"
                                        disabled={isLoading}
                                        onClick={() => {
                                            handleResetPassword(formValues)({ setIsLoading, setIsError, setUserInLocalStorage, navigate })
                                        }}
                                    >
                                        Invia
                                    </Button>
                                </Col>
                            </Row>
                        </Form>


                        {/* is error */}
                        {/*{isError && <Alert variant="danger">Something went wrong.</Alert>}*/}
                    </Col>
                </Row>
            </Container>
        </>
    )
}


const handleResetPassword = (formValues: ResetPasswordToAPI) => {
    return async (params: HandleResetPasswordParams) => {

        const {setIsLoading, setIsError, setUserInLocalStorage, navigate} = params

        setIsLoading(true)
        setIsError(false)

        authAPI
            .resetPasswordAtFirstLogin(formValues)
            .then((userFromAPI) => {
                console.log(userFromAPI)

                // update user in local storage
                // if we don't do this, in local storage
                // will remain the old user data
                setUserInLocalStorage(userFromAPI)

                // where the user will be redirected,
                // will depend on the user's role.
                navigate(AppRoutes.myProfile)

                setIsLoading(false)
                setIsError(false)

            })
            .catch((err: unknown) => {

                setIsLoading(false)
                setIsError(true)

                if (err instanceof UnauthorizedError) {

                    appEventDispatcher.dispatchStandard(
                        AppEvent.APP_ERROR,
                        AppEventMessageType.WRONG_CREDENTIALS
                    )

                }


            })

    }
}