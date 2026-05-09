import AppEventDispatcher from "../../../js/AppEventDispatcher.ts";
import {use, useState} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {UserRole} from "../../../js/my_types.ts";
import UserRoleHelper from "../../../js/helpers/UserRoleHelper.ts";


const appEventDispatcher: AppEventDispatcher = AppEventDispatcher.getInstance()

interface HandleAddUser {

}

const initialFormValues = {
    firstname: "",
    lastname: "",
    email: "",
    role: ""
}

export default function AddUserPage () {
    const [formValues, setFormValues] = useState(initialFormValues)
    // user role
    const [role, setRole] = useState<UserRole | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)


    // const navigate = useNavigate()
    console.log(role)

    return (
        <>
            <Container fluid>
                <Row className="d-flex justify-content-center">
                    <Col xs={12} md={6} lg={4}>

                        {/* title */}
                        <Row className={"mb-3"}>
                            <Col>
                                <h1 className="text-center">Aggiungi utente</h1>
                            </Col>
                        </Row>

                        {/* role */}
                        <Row className={"mb-3"}>
                            <Col>
                                <Form.Select onChange={(e) => {
                                    setRole(e.target.value as UserRole)
                                }}>
                                    {Object.entries(UserRoleHelper.getAllRolesMapExceptAdmin()).map(([role, label]) => (
                                        <option key={role} value={role}>{label}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Row>

                        <Row>
                            {/* form */}
                            <Form onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    // handleLogin(formValues)({ login, logout, authenticated, navigate, setIsError, setIsLoading });
                                }
                            }}>

                                {/* firstname */}
                                <Col>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Nome</Form.Label>
                                        <Form.Control
                                            disabled={isLoading}
                                            type="text"
                                            placeholder="Maria"
                                            value={formValues.firstname}
                                            onChange={(event) => {
                                                setFormValues({
                                                    ...formValues,
                                                    firstname: event.target.value,
                                                })
                                            }}
                                        />
                                    </Form.Group>
                                </Col>


                                {/* lastname */}
                                <Col>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Cognome</Form.Label>
                                        <Form.Control
                                            disabled={isLoading}
                                            type="text"
                                            placeholder="Rossi"
                                            value={formValues.lastname}
                                            onChange={(event) => {
                                                setFormValues({
                                                    ...formValues,
                                                    lastname: event.target.value,
                                                })
                                            }}
                                        />
                                    </Form.Group>
                                </Col>

                                {/* email */}
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


                                {/* submit */}
                                <Col className="text-center">
                                    <Button
                                        disabled={isLoading}
                                        variant="primary"
                                        onClick={() => {
                                            // handleLogin(formValues)({ login, logout, authenticated, navigate, setIsError, setIsLoading })
                                        }}
                                    >
                                        Aggiungi
                                    </Button>
                                </Col>
                            </Form>
                        </Row>

                    </Col>
                </Row>
            </Container>
        </>
    )
}

// const handleAddUser = (formValues: LoginToAPI) => {
//     return async (params: handleLoginParams) => {
//         const { login, logout, authenticated, navigate, setIsError, setIsLoading } = params
//
//         const authAPI = new AuthAPI()
//
//         setIsLoading(true)
//         setIsError(false)
//
//         authAPI
//             .login(formValues)
//             .then((loginInfo) => {
//
//                 setIsLoading(false)
//                 setIsError(false)
//
//                 const { accessToken } = loginInfo
//
//                 login(accessToken, loginInfo.user)
//
//                 // after successful login, where route the user
//                 // is redirected to
//                 navigate(AppRoutes.dashboard)
//
//                 appEventDispatcher.dispatchStandard(
//                     AppEvent.APP_SUCCESS,
//                     AppEventMessageType.LOGIN_SUCCESS
//                 )
//
//             })
//             .catch((err) => {
//
//                 setIsLoading(false)
//                 setIsError(true)
//
//                 if (err instanceof UnauthorizedError) {
//
//                     appEventDispatcher.dispatchStandard(
//                         AppEvent.APP_ERROR,
//                         AppEventMessageType.WRONG_CREDENTIALS
//                     )
//
//                 } else if (err instanceof ForbiddenError) {
//
//                     appEventDispatcher.dispatchStandard(
//                         AppEvent.APP_ERROR,
//                         AppEventMessageType.MUST_VERIFY_EMAIL
//                     )
//
//                 }
//             })
//     }
//
// }
