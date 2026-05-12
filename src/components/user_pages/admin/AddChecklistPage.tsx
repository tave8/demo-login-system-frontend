import {Alert, Button, Col, Container, Form, ListGroup, Row, Spinner, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import AppEventDispatcher from "../../../js/AppEventDispatcher.ts";
import GeocodingAPI from "../../../js/api/GeocodingAPI.ts";
import ClientsAPI from "../../../js/api/ClientsAPI.ts";
import {
    ChecklistToAPI,
    ClientToAPI,
    EnrichedGeocodingAutocompleteItemFromAPI,
    TaskFromAPI
} from "../../../js/my_types.ts";
import TasksAPI from "../../../js/api/TasksAPI.ts";
import ChecklistsAPI from "../../../js/api/ChecklistsAPI.ts";

const appEventDispatcher: AppEventDispatcher = AppEventDispatcher.getInstance()
const tasksAPI = TasksAPI.getInstance()
const checklistsAPI = ChecklistsAPI.getInstance()

interface HandleAddChecklistParams {
    setIsLoading: (x:boolean) => void
    setIsError: (x:boolean) => void
    setFormValues: (checklist: ChecklistToAPI) => void
}


const initialFormValues: ChecklistToAPI = {
    name: "",
    tasks: []
}

export default function AddChecklistPage() {
    const [formValues, setFormValues] = useState(initialFormValues)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    // the existing company's tasks
    const [tasks, setTasks] = useState<TaskFromAPI[]>([])

    // the tasks selected by user, when they click on it
    const [selectedTasks, setSelectedTasks] = useState<TaskFromAPI[]>([])

    // get the tasks
    useEffect(() => {

        setIsLoading(true)
        setIsError(false)

        tasksAPI
            .getTasks()
            .then((tasksPage) => {
                setIsLoading(false)
                setIsError(false)

                setTasks(tasksPage.content)

            })
            .catch((err) => {

                setIsLoading(false)
                setIsError(true)

            })

    }, [])


    const addTaskToSelectedTasks = (taskToAdd: TaskFromAPI) =>
    {

        setSelectedTasks([
            ...selectedTasks,
            taskToAdd
        ])

    }

    const removeTaskFromSelectedTasks = (taskToRemove: TaskFromAPI) =>
    {

        // search this task
        const tasksWithoutTarget = selectedTasks.filter(task => task.taskId != taskToRemove.taskId)

        // update selected tasks
        setSelectedTasks(tasksWithoutTarget)

    }

    /**
     * When the user selects a task.
     */
    const onTaskSelected = (task: TaskFromAPI, isSelected: boolean) =>
    {

        // if the user has selected the UI element,
        // this task must be added
        // else this task must be removed
        if(isSelected) {
            addTaskToSelectedTasks(task)
        } else {
            removeTaskFromSelectedTasks(task)
        }

    }


    return (
        <>
            <Container fluid>
                <Row className="d-flex justify-content-center">
                    <Col xs={12} md={6} lg={4}>

                        {/* title */}
                        <Row className={"mb-3"}>
                            <Col>
                                <h1 className="text-center">Aggiungi Scheda attività</h1>
                                {/*<p className={"text-center mt-3"}><Link to={AppRoutes.addClientAddress}>Già aggiunto il cliente e vuoi aggiungere una sede?</Link></p>*/}

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
                                        // handleAddClient(formValues)({ setIsError, setIsLoading, setFormValues });
                                    }
                                }}>

                                {/* checklist name */}
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Nome scheda</Form.Label>
                                            <Form.Control
                                                disabled={isLoading}
                                                type="text"
                                                autoFocus={true}
                                                placeholder="es. Pulizia Hotel"
                                                value={formValues.name}
                                                onChange={(event) => {
                                                    setFormValues({
                                                        ...formValues,
                                                        name: event.target.value,
                                                    })
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>


                                {/* tasks list */}
                                <Row>
                                    <Col>
                                        <Table striped bordered hover responsive>
                                            <thead>
                                            <tr>
                                                <th>Attività</th>
                                                <th></th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {tasks.map(task => (
                                                // make this key unique
                                                <tr key={task.taskId}>
                                                    <td>{task.name}</td>
                                                    <td>
                                                        <Form.Check
                                                            type="checkbox"
                                                            onChange={(e) => {
                                                                const isSelected = e.target.checked
                                                                onTaskSelected(task, isSelected)
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </Table>
                                    </Col>

                                </Row>

                                <Row>
                                    <Col>
                                        <h4>{formValues.name} ha queste attività:</h4>
                                    </Col>
                                </Row>

                                {/* selected tasks list */}
                                <Row>
                                    <Col>

                                        {selectedTasks.map(task => {
                                            return (
                                                <div key={task.taskId}>
                                                    <p>{task.name}</p>
                                                </div>
                                            )
                                        })}

                                    </Col>
                                </Row>

                                <Row className={"mt-3"}>
                                    {/* submit */}
                                    <Col className="text-center">
                                        <Button
                                            disabled={isLoading}
                                            variant="primary"
                                            onClick={() => {
                                                // handleAddClient(formValues)({ setIsError, setIsLoading, setFormValues });
                                            }}
                                        >
                                            Aggiungi scheda
                                        </Button>
                                    </Col>
                                </Row>

                            </Form>
                        </Row>


                    </Col>
                </Row>
            </Container>
        </>
    )
}