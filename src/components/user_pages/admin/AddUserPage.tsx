import AppEventDispatcher from "../../../js/AppEventDispatcher.ts";
import {useState} from "react";
import {Alert, Button, Col, Container, Form, Modal, Row} from "react-bootstrap";
import {AppEvent, AppEventMessageType, NewUserFromAPI, NewUserToAPI, UserRole} from "../../../js/my_types.ts";
import UserRoleHelper from "../../../js/helpers/UserRoleHelper.ts";
import UsersAPI from "../../../js/api/UsersAPI.ts";
import UnauthorizedError from "../../../js/exceptions/UnauthorizedError.ts";
import StringHelper from "../../../js/helpers/StringHelper.ts";
import AppHelper from "../../../js/helpers/AppHelper.ts";


const appEventDispatcher: AppEventDispatcher = AppEventDispatcher.getInstance()
const usersAPI = UsersAPI.getInstance()


interface HandleAddUserParams {
    setIsLoading: (x:boolean) => void
    setIsError: (x:boolean) => void
    setShowModal: (x: boolean) => void
    setFormValues: (user: NewUserToAPI) => void
    setUserFromAPI: (user: NewUserFromAPI) => void
    formValues: NewUserToAPI
}

const initialFormValues: NewUserToAPI = {
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

    // what we get back from the server, once
    // this user is added
    const [userFromAPI, setUserFromAPI] = useState<NewUserFromAPI|null>(null)

    const [showModal, setShowModal] = useState(false)

    // refactor handlers here


    return (
        <>
            <Container fluid>
                <Row className="d-flex justify-content-center">
                    <Col xs={12} md={6} lg={4}>

                        {/* title */}
                        <Row className={"mb-3"}>
                            <Col>
                                <h1 className="text-center">Aggiungi Utente</h1>
                                <Alert variant="primary" className={"mt-4"}>
                                    Nota: I coordinatori avranno bisogno di un'email,
                                    mentre gli operatori no. Verrà generata una password temporanea
                                    con la quale potranno loggarsi, che dovrai mandargli.
                                </Alert>
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
                                    handleAddUser(formValues)({ setIsError, setIsLoading, setShowModal, setUserFromAPI, setFormValues, formValues })
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
                                            autoFocus={true}
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
                                            handleAddUser(formValues)({ setIsError, setIsLoading, setShowModal, setUserFromAPI,setFormValues, formValues })
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

            {/* modal to show admin username & password of newly added user */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Prossimo passo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant="primary" className="mb-3">
                        Copia il messaggio qui sotto e mandalo all'utente.
                        Puoi vedere questa password temporanea solo una volta.
                    </Alert>

                    <Form.Control
                        as="textarea"
                        readOnly
                        rows={10}
                        onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                        value={getCopyPasteMessage(userFromAPI)}
                    />
                </Modal.Body>
                <Modal.Footer>

                    {/* copy to clipboard */}
                    <Button variant={"success"} onClick={() => {
                        // copy text to clipboard
                        navigator.clipboard.writeText( getCopyPasteMessage(userFromAPI) )
                        // tell user that text was copied to their clipboard
                        appEventDispatcher.dispatchStandard(
                            AppEvent.APP_SUCCESS,
                            AppEventMessageType.COPIED
                        )

                    }}>📋
                        Copia
                    </Button>

                    {/* send with whatsapp */}
                    <Button variant={"success"}
                            href={`https://wa.me/?text=${encodeURIComponent(getCopyPasteMessage(userFromAPI))}`}
                            target="_blank"
                    >
                        💬 WhatsApp
                    </Button>

                    {/* done */}
                    <Button variant={"secondary"} onClick={() => {
                        // close modal
                        setShowModal(false)
                    }}>
                        Fatto
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    )
}

const handleAddUser = (formValues: NewUserToAPI) => {
    return async (params: HandleAddUserParams) => {
        const { setIsError, setIsLoading, setShowModal, setUserFromAPI, setFormValues, formValues } = params

        const isAddingCoordinator = formValues.role == UserRole.COORDINATOR


        // if it's adding a coordinator, must provide email
        if(isAddingCoordinator) {

            const isValidEmail = StringHelper.isValidEmail(formValues.email)

            if(!isValidEmail) {

                appEventDispatcher.dispatch(
                    AppEvent.APP_ERROR,
                    "Quando aggiungi un coordinatore, deve fornire un email valida."
                )

                return

            }
        }

        setIsLoading(true)
        setIsError(false)

        usersAPI
            .addUser(formValues)
            .then((userFromAPI) => {

                setIsLoading(false)
                setIsError(false)

                setUserFromAPI(userFromAPI)

                setTimeout(() => {
                    setShowModal(true)
                }, 200)


                appEventDispatcher.dispatchStandard(
                    AppEvent.APP_SUCCESS,
                    AppEventMessageType.SAVE_SUCCESS
                )

                //  reset form values
                setFormValues({
                    ...formValues,
                    firstname: "",
                    lastname: "",
                    email: ""
                })

            })
            .catch((err) => {

                setIsLoading(false)
                setIsError(true)
                //
                if (err instanceof UnauthorizedError) {

                    appEventDispatcher.dispatchStandard(
                        AppEvent.APP_ERROR,
                        AppEventMessageType.CANNOT_USE_EMAIL
                    )

                 } else {

                    appEventDispatcher.dispatchStandard(
                        AppEvent.APP_ERROR,
                        AppEventMessageType.SAVE_ERROR
                    )

                }


            })

    }

}


const getCopyPasteMessage = (userFromAPI: NewUserFromAPI|null): string => {

    if(userFromAPI == null) {
        return ""
    }

    if(userFromAPI.role == UserRole.COORDINATOR) {

        const loginURL = AppHelper.getFrontendUrlAt("/auth/login")

        return [
            `Ciao ${userFromAPI.firstname},`,
            `ti ho appena aggiunto come coordinatore al gestionale ZeroChiamate.`,
            ``,
            `ZeroChiamate ti permette di gestire turni, operatori e cantieri dei clienti — tutto in un unico posto, da qualsiasi dispositivo.`,
            ``,
            `Ecco le tue credenziali:`,
            ``,
            `Email:`,
            `${userFromAPI.email}`,
            ``,
            `Password temporanea:`,
            `${userFromAPI.tempPassword}`,
            ``,
            `Al tuo primo login, potrai cambiare la tua password.`,
            ``,
            `Fai login qui:`,
            `${loginURL}`,
            ``,
            `Inoltre, il gestionale ti ha appena mandato un link alla tua email ${userFromAPI.email} per verificare che sei tu, semplicemente cliccalo.`,
            ``,
            `Buon proseguimento`,
        ].join("\n")
    }

    const loginURL = AppHelper.getFrontendUrlAt("/auth/login-operator")

    // OPERATOR
    return [
        `Ciao ${userFromAPI.firstname},`,
        `ti ho appena aggiunto al gestionale ZeroChiamate.`,
        ``,
        `ZeroChiamate ti permette di vedere i tuoi turni, le sedi dove devi andare e le attività da svolgere — tutto in un unico posto, dal tuo telefono.`,
        ``,
        `Ecco le tue credenziali:`,
        ``,
        `Username:`,
        `${userFromAPI.username}`,
        ``,
        `Password temporanea:`,
        `${userFromAPI.tempPassword}`,
        ``,
        `Al tuo primo login, potrai cambiare la tua password.`,
        ``,
        `Fai login qui:`,
        `${loginURL}`,
        ``,
        `Buon proseguimento`,
    ].join("\n")

}