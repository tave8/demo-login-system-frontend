import AppEventDispatcher from "../../../js/AppEventDispatcher.ts";
import {useState} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {AppEvent, AppEventMessageType, UserRole, UserToAPI} from "../../../js/my_types.ts";
import UserRoleHelper from "../../../js/helpers/UserRoleHelper.ts";
import UsersAPI from "../../../js/api/UsersAPI.ts";


const appEventDispatcher: AppEventDispatcher = AppEventDispatcher.getInstance()
const usersAPI = UsersAPI.getInstance()


interface HandleAddUserParams {
    setIsLoading: (x:boolean) => void
    setIsError: (x:boolean) => void
}

const initialFormValues: UserToAPI = {
    firstname: "",
    lastname: "",
    email: "",
    // we simply set the operator as the default role
    role: UserRole.OPERATOR
}

export default function AddUserPage () {
    const [formValues, setFormValues] = useState(initialFormValues)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)


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
                                <Form.Label>Ruolo</Form.Label>
                                <Form.Select
                                    value={formValues.role}
                                    onChange={(e) => {

                                    setFormValues({
                                        ...formValues,
                                        role: e.target.value as UserRole
                                    })
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
                                    handleAddUser(formValues)({ setIsError, setIsLoading })
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
                                {/* only coordinators have email */}
                                {formValues.role == UserRole.COORDINATOR && (
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
                                )}



                                {/* submit */}
                                <Col className="text-center">
                                    <Button
                                        disabled={isLoading}
                                        variant="primary"
                                        onClick={() => {
                                            handleAddUser(formValues)({ setIsError, setIsLoading })
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

const handleAddUser = (formValues: UserToAPI) => {
    return async (params: HandleAddUserParams) => {
        const { setIsError, setIsLoading } = params


        setIsLoading(true)
        setIsError(false)

        usersAPI
            .addUser(formValues)
            .then((loginInfo) => {

                setIsLoading(false)
                setIsError(false)

                appEventDispatcher.dispatchStandard(
                    AppEvent.APP_SUCCESS,
                    AppEventMessageType.SAVE_SUCCESS
                )

            })
            .catch((err) => {

                setIsLoading(false)
                setIsError(true)
                //
                // if (err instanceof UnauthorizedError) {
                //
                //     appEventDispatcher.dispatchStandard(
                //         AppEvent.APP_ERROR,
                //         AppEventMessageType.WRONG_CREDENTIALS
                //     )
                //
                // } else if (err instanceof ForbiddenError) {
                //
                //     appEventDispatcher.dispatchStandard(
                //         AppEvent.APP_ERROR,
                //         AppEventMessageType.MUST_VERIFY_EMAIL
                //     )
                //
                // }


                appEventDispatcher.dispatchStandard(
                    AppEvent.APP_ERROR,
                    AppEventMessageType.SAVE_ERROR
                )

            })

    }

}
