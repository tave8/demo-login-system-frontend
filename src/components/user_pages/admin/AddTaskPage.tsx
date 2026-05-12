import AppEventDispatcher from "../../../js/AppEventDispatcher.ts";
import {useState} from "react";
import {Alert, Button, Col, Container, Form, Modal, Row} from "react-bootstrap";
import {
    AppEvent,
    AppEventMessageType,
    NewUserFromAPI,
    NewUserToAPI,
    TaskToAPI,
    UserRole
} from "../../../js/my_types.ts";
import UserRoleHelper from "../../../js/helpers/UserRoleHelper.ts";
import UsersAPI from "../../../js/api/UsersAPI.ts";
import UnauthorizedError from "../../../js/exceptions/UnauthorizedError.ts";
import StringHelper from "../../../js/helpers/StringHelper.ts";
import TasksAPI from "../../../js/api/TasksAPI.ts";


const appEventDispatcher: AppEventDispatcher = AppEventDispatcher.getInstance()
const tasksAPI = TasksAPI.getInstance()


interface HandleAddTaskParams {
    setIsLoading: (x:boolean) => void
    setIsError: (x:boolean) => void
    setFormValues: (task: TaskToAPI) => void
}

const initialFormValues: TaskToAPI = {
    name: ""
}

export default function AddTaskPage () {
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
                                <h1 className="text-center">Aggiungi Attività</h1>
                                <Alert variant="primary" className={"mt-4"}>
                                    Crea l'attività una sola volta e riutilizzala in qualsiasi Scheda Attività.
                                </Alert>
                            </Col>
                        </Row>

                        <Row>
                            {/* form */}
                            <Form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                }}
                                onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleAddTask(formValues)({ setIsError, setIsLoading, setFormValues })
                                }
                            }}>

                                {/* task name */}
                                <Col>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Nome attività</Form.Label>
                                        <Form.Control
                                            disabled={isLoading}
                                            type="text"
                                            placeholder="es. Pulisci il primo piano"
                                            value={formValues.name}
                                            autoFocus={true}
                                            onChange={(event) => {
                                                setFormValues({
                                                    ...formValues,
                                                    name: event.target.value,
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
                                            handleAddTask(formValues)({ setIsError, setIsLoading, setFormValues })
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

const handleAddTask = (formValues: TaskToAPI) => {
    return async (params: HandleAddTaskParams) => {

        const { setIsError, setIsLoading, setFormValues } = params

        console.log(formValues)

        setIsLoading(true)
        setIsError(false)

        tasksAPI
            .addTask(formValues)
            .then((taskFromAPI) => {

                setIsLoading(false)
                setIsError(false)

                appEventDispatcher.dispatchStandard(
                    AppEvent.APP_SUCCESS,
                    AppEventMessageType.SAVE_SUCCESS
                )

                //  reset form values
                setFormValues({
                    name: ""
                })

            })
            .catch((err) => {

                setIsLoading(false)
                setIsError(true)


                appEventDispatcher.dispatchStandard(
                    AppEvent.APP_ERROR,
                    AppEventMessageType.SAVE_ERROR
                )


            })

    }

}
