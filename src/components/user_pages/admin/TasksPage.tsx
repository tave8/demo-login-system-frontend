import {Alert, Button, Col, Container, Row, Table} from "react-bootstrap";
import UsersAPI from "../../../js/api/UsersAPI.ts";
import {useEffect, useState} from "react";
import ArticlesAPI from "../../../js/api/ArticlesAPI.ts";
import UnauthorizedError from "../../../js/exceptions/UnauthorizedError.ts";
import {
    EnrichedClientAddressFromAPI,
    EnrichedClientFromAPI,
    EnrichedUserFromAPI,
    TaskFromAPI
} from "../../../js/my_types.ts";
import ClientsAPI from "../../../js/api/ClientsAPI.ts";
import ClientAddressesAPI from "../../../js/api/ClientAddressesAPI.ts";
import TasksAPI from "../../../js/api/TasksAPI.ts";

const tasksAPI = TasksAPI.getInstance()


export default function TasksPage() {
    const [tasks, setTasks] = useState<TaskFromAPI[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

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

    return (
        <>
            <Container fluid>
                <Row className="d-flex justify-content-center">
                    <Col xs={12} md={9}>

                        {/* title */}
                        <Row className={"mb-3"}>
                            <Col>
                                <h1 className="text-center">Attività</h1>
                                <Alert variant="primary" className="mb-3">
                                    Le Attività sono quello che dimostra risultati ai tuoi clienti.
                                    Organizza le Attività in Schede Attività, che è quello che gli
                                    operatori vedranno e faranno nei loro turni.
                                </Alert>
                            </Col>
                        </Row>

                        {/* table    */}
                        <Row>
                            <Col>

                                <Table striped bordered hover responsive>
                                    <thead>
                                    <tr>
                                        <th>Attività</th>
                                        <th>Azioni</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {tasks.map(task => (
                                        // make this key unique
                                        <tr key={task.taskId}>
                                            <td>{task.name}</td>
                                            <td>
                                                {/*<Button variant="outline-primary" size="sm">Modifica</Button>*/}
                                                {/*{' '}*/}
                                                {/*<Button variant="outline-danger" size="sm">Elimina</Button>*/}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            </Col>

                        </Row>

                    </Col>
                </Row>
            </Container>
        </>
    )
}