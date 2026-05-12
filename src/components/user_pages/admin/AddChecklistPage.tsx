import {Alert, Button, Col, Container, Form, ListGroup, Row, Spinner} from "react-bootstrap";
import {useState} from "react";
import AppEventDispatcher from "../../../js/AppEventDispatcher.ts";
import GeocodingAPI from "../../../js/api/GeocodingAPI.ts";
import ClientsAPI from "../../../js/api/ClientsAPI.ts";
import {ChecklistToAPI, ClientToAPI, EnrichedGeocodingAutocompleteItemFromAPI} from "../../../js/my_types.ts";
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
                            </Form>
                        </Row>


                    </Col>
                </Row>
            </Container>
        </>
    )
}