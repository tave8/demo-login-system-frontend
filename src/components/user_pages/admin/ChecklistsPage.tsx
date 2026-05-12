import {Button, Col, Container, Row, Table} from "react-bootstrap";
import UsersAPI from "../../../js/api/UsersAPI.ts";
import {useEffect, useState} from "react";
import ArticlesAPI from "../../../js/api/ArticlesAPI.ts";
import UnauthorizedError from "../../../js/exceptions/UnauthorizedError.ts";
import {
    ChecklistFromAPI,
    EnrichedClientAddressFromAPI,
    EnrichedClientFromAPI,
    EnrichedUserFromAPI,
    TaskFromAPI
} from "../../../js/my_types.ts";
import ClientsAPI from "../../../js/api/ClientsAPI.ts";
import ClientAddressesAPI from "../../../js/api/ClientAddressesAPI.ts";
import TasksAPI from "../../../js/api/TasksAPI.ts";
import ChecklistsAPI from "../../../js/api/ChecklistsAPI.ts";

const checklistsAPI = ChecklistsAPI.getInstance()

export default function TasksPage() {
    const [checklists, setChecklists] = useState<ChecklistFromAPI[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    // get the checklists
    useEffect(() => {

        setIsLoading(true)
        setIsError(false)

        checklistsAPI
            .getChecklists()
            .then((checklistsPage) => {
                setIsLoading(false)
                setIsError(false)

                setChecklists(checklistsPage.content)

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
                                <h1 className="text-center">Schede attività</h1>
                            </Col>
                        </Row>

                        {/* table    */}
                        <Row>
                            <Col>

                                <Table striped bordered hover responsive>
                                    <thead>
                                    <tr>
                                        <th>Scheda</th>
                                        <th>Azioni</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {checklists.map(checklist => (
                                        // make this key unique
                                        <tr key={checklist.id}>
                                            <td>{checklist.name}</td>
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