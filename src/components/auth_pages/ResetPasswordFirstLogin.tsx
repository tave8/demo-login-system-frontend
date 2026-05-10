import {Alert, Button, Col, Container, Form, Row, Spinner} from "react-bootstrap";
import {useState} from "react";
import {ForgotPasswordRequestToAPI, ResetPasswordToAPI} from "../../js/my_types.ts";
import AuthAPI from "../../js/api/AuthAPI.ts";
import UnauthorizedError from "../../js/exceptions/UnauthorizedError.ts";
import ForbiddenError from "../../js/exceptions/ForbiddenError.ts";

const initialData: ResetPasswordToAPI = {
    oldPassword: "",
    newPassword: ""
}

interface HandleResetPasswordParams {
    setIsLoading: (x: boolean) => void
    setIsError: (x: boolean) => void
}


export default function ResetPasswordFirstLogin() {
    const [formValues, setFormValues] = useState(initialData)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

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
                                handleResetPassword(formValues)({ setIsLoading, setIsError })
                            }
                        }}>

                        {!isLoading && !isError && (
                            <>
                                {/* old password */}
                                <Row className="g-3">
                                    <Col xs={12}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Password temporanea</Form.Label>
                                            <Form.Control
                                                type="password"
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
                                            onClick={() => {
                                                handleResetPassword(formValues)({ setIsLoading, setIsError })
                                            }}
                                        >
                                            Invia
                                        </Button>
                                    </Col>
                                </Row>
                            </>
                        )}
                        </Form>

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


const handleResetPassword = (formValues: ResetPasswordToAPI) => {
    return async (params: HandleResetPasswordParams) => {
        console.log(formValues, params)

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