import {Button, Col, Container, Row, Table} from "react-bootstrap";
import UsersAPI from "../../../js/api/UsersAPI.ts";
import {useEffect, useState} from "react";
import ArticlesAPI from "../../../js/api/ArticlesAPI.ts";
import UnauthorizedError from "../../../js/exceptions/UnauthorizedError.ts";
import {EnrichedClientFromAPI, EnrichedUserFromAPI} from "../../../js/my_types.ts";
import ClientsAPI from "../../../js/api/ClientsAPI.ts";

const clientsAPI = ClientsAPI.getInstance()


export default function ClientsPage() {
    const [clients, setClients] = useState<EnrichedClientFromAPI[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    // get the clients
    useEffect(() => {

        // load my clients

        setIsLoading(true)
        setIsError(false)

        clientsAPI
            .getClientsEnriched()
            .then((clientsPage) => {
                setIsLoading(false)
                setIsError(false)

                setClients(clientsPage.content)

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
                                <h1 className="text-center">Clienti</h1>
                            </Col>
                        </Row>

                        {/* table    */}
                        <Row>
                            <Col>

                                <Table striped bordered hover responsive>
                                    <thead>
                                    <tr>
                                        <th>Azienda</th>
                                        <th>Telefono</th>
                                        <th>Email</th>
                                        <th>Sede legale</th>
                                        <th>Azioni</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {clients.map(client => (
                                        <tr key={client.clientId}>
                                            <td>{client.legalName}</td>
                                            <td>{client.phone}</td>
                                            <td>{client.email}</td>
                                            <td>{client.legalAddress}</td>
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