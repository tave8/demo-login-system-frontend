import {Alert, Button, Col, Container, Form, Image, Row, Spinner} from "react-bootstrap";
import {useEffect, useState} from "react";
import {useAuth} from "../../auth/AuthContext.tsx";
import {
    AppRoutes,
    ForgotPasswordNewPasswordToAPI,
    ForgotPasswordRequestToAPI,
    UpdatedUserToAPI,
    UserFromAPI
} from "../../js/my_types.ts";
import UsersAPI from "../../js/UsersAPI.ts";
import UnauthorizedError from "../../js/exceptions/UnauthorizedError.ts";
import AuthAPI from "../../js/AuthAPI.ts";
import ForbiddenError from "../../js/exceptions/ForbiddenError.ts";
import {useNavigate, useParams} from "react-router-dom";

type RouteURLParams = {
    code: string
}

const initialNewPasswordData: ForgotPasswordNewPasswordToAPI = {
    newPassword: "",
    code: ""
}

interface HandleForgotPasswordNewPasswordParams {
    setIsLoading: (x: boolean) => void
    setIsError: (x: boolean) => void
}


const ForgotPasswordSetNewPasswordPage = () => {
    const [newPasswordData, setNewPasswordData] = useState(initialNewPasswordData)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    const params = useParams<RouteURLParams>()
    const navigate = useNavigate()

    // when page is first loaded, verify that
    // the code in the URL route is valid
    useEffect(() => {

        const code = params.code

        if(!code) {
            navigate(AppRoutes.home)
            return
        }

        // console.log(code)



    }, [])

    return (
        <>
            <Container fluid>
                <Row className="d-flex justify-content-center">
                    <Col xs={12} md={9} lg={6}>
                        {/* title */}
                        <Row className="mb-3">
                            <Col>
                                <h1 className="text-center">Set new password</h1>
                            </Col>
                        </Row>

                        {/* info alert */}
                        <Row>
                            <Alert variant={"primary"}>
                                <p>For your safety, this page will soon expire and is only accessible by you.
                                    After you set your new password, it will be removed.</p>
                            </Alert>
                        </Row>

                        {/* my profile info */}

                        {!isLoading && !isError && (
                            <>
                                <Row className="g-3">
                                    <Col xs={12}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Type in your new password"
                                                value={newPasswordData.newPassword}
                                                onChange={(event) => {
                                                    // setEmailData({
                                                    //     ...emailData,
                                                    //     email: event.target.value,
                                                    // })
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mt-2">
                                    <Col xs={12} className="text-center">
                                        <Button
                                            className="btn btn-primary"
                                            onClick={() => {
                                                handleForgotPasswordNewPassword(newPasswordData)({ setIsLoading, setIsError })
                                            }}
                                        >
                                            Set new password
                                        </Button>
                                    </Col>
                                </Row>
                            </>
                        )}

                        {/* is loading */}
                        {isLoading && (
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        )}

                        {/* is error */}
                        {isError && <Alert variant="danger">Something went wrong.</Alert>}
                    </Col>
                </Row>
            </Container>
        </>
    )
}


const handleForgotPasswordNewPassword = (newPasswordData: ForgotPasswordNewPasswordToAPI) => {
    return async (params: HandleForgotPasswordNewPasswordParams) => {
        console.log(newPasswordData)
        // console.log(emailData, params)

        // const authAPI = new AuthAPI();
        //
        // authAPI
        //     .sendForgotPasswordRequest(emailData)
        //     .then((msgFromServer) => {
        //         // console.log(userData)
        //         alert(msgFromServer.message)
        //     })
        //     .catch((err: unknown) => {
        //         if (err instanceof UnauthorizedError || err instanceof ForbiddenError) {
        //             // logout()
        //             console.log(err.message)
        //             alert("You cannot set a new password right now.")
        //         } else {
        //             console.info("Error during forgot password request")
        //             console.error(err)
        //         }
        //     })
    }
}


export default ForgotPasswordSetNewPasswordPage