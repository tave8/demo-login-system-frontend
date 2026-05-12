import {Alert, Button, Col, Container, Form, ListGroup, Row, Spinner, Table} from "react-bootstrap";
import {useEffect, useRef, useState} from "react";
import AppEventDispatcher from "../../../js/AppEventDispatcher.ts";
import GeocodingAPI from "../../../js/api/GeocodingAPI.ts";
import ClientsAPI from "../../../js/api/ClientsAPI.ts";
import {
    AppEvent, AppEventMessageType,
    ChecklistToAPI,
    ClientToAPI,
    EnrichedGeocodingAutocompleteItemFromAPI,
    TaskFromAPI
} from "../../../js/my_types.ts";
import TasksAPI from "../../../js/api/TasksAPI.ts";
import ChecklistsAPI from "../../../js/api/ChecklistsAPI.ts";
import BadRequestError from "../../../js/exceptions/BadRequestError.ts";

const appEventDispatcher: AppEventDispatcher = AppEventDispatcher.getInstance()
const tasksAPI = TasksAPI.getInstance()
const checklistsAPI = ChecklistsAPI.getInstance()

// ******************
// PARAMS OF ADD CHECKLIST HANDLER
// ******************

interface HandleAddChecklistParams {
    setIsLoading: (x:boolean) => void
    setIsError: (x:boolean) => void
    setFormValues: (checklist: ChecklistToAPI) => void
}

// ******************
// INITIAL FORM VALUES
// ******************

const initialFormValues: ChecklistToAPI = {
    name: "",
    entries: []
}

// ******************
// REACT COMPONENT
// ******************

export default function AddChecklistPage() {
    const [formValues, setFormValues] = useState(initialFormValues)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    // the existing company's tasks
    const [tasks, setTasks] = useState<TaskFromAPI[]>([])

    // the tasks selected by user, when they click on it
    const [selectedTasks, setSelectedTasks] = useState<TaskFromAPI[]>([])

    // ******************
    // DRAG & DROP OF SELECTED TASKS
    // ******************

    const dragIndex = useRef<number>(0)

    const onDrop = (index: number) => {
        const reordered = Array.from(selectedTasks)
        const [removed] = reordered.splice(dragIndex.current, 1)
        reordered.splice(index, 0, removed)
        setSelectedTasks(reordered)
    }

    // ******************
    // GET TASKS ON FIRST LOAD
    // ******************

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


    // ******************
    // TRANSFORM TASKS INTO ENTRIES
    // ******************

    // every time selected tasks is updated,
    // we update the form values
    useEffect(() => {

        setFormValues({
            ...formValues,
            // we map a task to an entry
            // a task has:
            // - id
            // - name
            // an entry has:
            // - task id
            // - position
            entries: selectedTasks.map((task, idx) => {
                return {
                    taskId: task.taskId,
                    position: idx+1
                }
            })
        })

    }, [selectedTasks]);


    // ******************
    // WHEN TASK IS SELECTED: ADD IT
    // ******************

    const addTaskToSelectedTasks = (taskToAdd: TaskFromAPI) =>
    {

        setSelectedTasks([
            ...selectedTasks,
            taskToAdd
        ])

    }

    // ******************
    // WHEN TASK IS DE-SELECTED: REMOVE IT
    // ******************

    const removeTaskFromSelectedTasks = (taskToRemove: TaskFromAPI) =>
    {

        // search this task
        const tasksWithoutTarget = selectedTasks.filter(task => task.taskId != taskToRemove.taskId)

        // update selected tasks
        setSelectedTasks(tasksWithoutTarget)

    }

    // ******************
    // WHEN TASK WAS TOGGLED: ADD OR REMOVE?
    // ******************


    /**
     * When the user selects a task.
     */
    const onTaskSelected = (task: TaskFromAPI,
                                                                isSelected: boolean) =>
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


    // ******************
    // COMPONENT
    // ******************


    return (
        <>
            <Container fluid>
                <Row className="d-flex justify-content-center ">
                    <Col xs={12} md={9} lg={6}>

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

                                        handleAddChecklist(formValues)({ setIsError, setIsLoading, setFormValues });

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
                                    <Col  className="d-flex justify-content-center">
                                        <Table striped bordered hover responsive style={{ tableLayout: "fixed", maxWidth:"500px" }}>
                                            <thead>
                                            <tr>
                                                <th>Attività</th>
                                                <th style={{ width: "90px" }}></th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {tasks.map(task => (
                                                // make this key unique
                                                <tr key={task.taskId}>
                                                    <td>{task.name}</td>
                                                    <td className={"text-center"}>
                                                        <Form.Check
                                                            type="checkbox"
                                                            onChange={(e) => {
                                                                const isSelected = e.target.checked
                                                                // when user clicks on this checkbox,
                                                                // we fire a custom callback that will
                                                                // add or remove that task from the selected tasks
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

                                <Row className={"my-3"}>
                                    <Col>
                                        <h5>{formValues.name} ha queste attività:</h5>
                                    </Col>
                                </Row>

                                {/* selected tasks list */}
                                <Row>
                                    <Col  className="d-flex justify-content-center">
                                        <Table striped bordered hover responsive style={{ tableLayout: "fixed", maxWidth: "500px" }}>
                                            <thead>
                                                <tr>
                                                    <th style={{ width: "60px" }}>#</th>
                                                    <th>Attività</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedTasks.map((task, index) => (
                                                    <tr key={task.taskId}
                                                        draggable
                                                        onDragStart={() => dragIndex.current = index}
                                                        onDragOver={(e) => e.preventDefault()}
                                                        onDrop={() => onDrop(index)}
                                                        style={{ cursor: "grab" }}
                                                    >
                                                        <td>{index+1}</td>
                                                        <td>{task.name}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <small className="text-muted">💡 Trascina le righe per riordinare
                                            le attività (disponibile solo da computer)</small>
                                    </Col>
                                </Row>

                                {/* submit */}
                                <Row className={"mt-3"}>
                                    <Col className="text-center">
                                        <Button
                                            disabled={isLoading}
                                            variant="primary"
                                            onClick={() => {
                                                handleAddChecklist(formValues)({ setIsError, setIsLoading, setFormValues });
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




const handleAddChecklist = (formValues: ChecklistToAPI) =>
{
    return async (params: HandleAddChecklistParams) => {

        const { setIsError, setIsLoading, setFormValues } = params

        // before processing

        console.log(formValues)

        // requireValidFields(formValues)

        // setIsLoading(true)
        // setIsError(false)
        //
        // clientsAPI
        //     .addClient(formValues)
        //     .then((clientFromAPI) => {
        //
        //         setIsLoading(false)
        //         setIsError(false)
        //
        //         // reset form fields
        //         setFormValues({
        //             email: "",
        //             vat: "",
        //             legalAddressLat: 0,
        //             legalAddressLon: 0,
        //             legalName: "",
        //             legalAddress: "",
        //             phone: ""
        //         })
        //
        //
        //         appEventDispatcher.dispatchStandard(
        //             AppEvent.APP_SUCCESS,
        //             AppEventMessageType.SAVE_SUCCESS
        //         )
        //
        //     })
        //     .catch((err) => {
        //
        //         setIsLoading(false)
        //         setIsError(true)
        //
        //         if (err instanceof BadRequestError) {
        //
        //             appEventDispatcher.dispatchStandard(
        //                 AppEvent.APP_ERROR,
        //                 AppEventMessageType.BAD_REQUEST
        //             )
        //
        //         }
        //     })
    }

}
