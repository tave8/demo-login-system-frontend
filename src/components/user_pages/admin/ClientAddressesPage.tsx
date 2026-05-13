import {Alert, Button, Col, Container, Row, Table} from "react-bootstrap";
import UsersAPI from "../../../js/api/UsersAPI.ts";
import {useEffect, useState} from "react";
import ArticlesAPI from "../../../js/api/ArticlesAPI.ts";
import UnauthorizedError from "../../../js/exceptions/UnauthorizedError.ts";
import {EnrichedClientAddressFromAPI, EnrichedClientFromAPI, EnrichedUserFromAPI} from "../../../js/my_types.ts";
import ClientsAPI from "../../../js/api/ClientsAPI.ts";
import ClientAddressesAPI from "../../../js/api/ClientAddressesAPI.ts";

const clientsAPI = ClientsAPI.getInstance()
const clientAddressesAPI = ClientAddressesAPI.getInstance()

export default function ClientAddressesPage() {
    const [clientAddresses, setClientAddresses] = useState<EnrichedClientAddressFromAPI[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    // get the clients
    useEffect(() => {

        // load my clients

        setIsLoading(true)
        setIsError(false)

        clientAddressesAPI
        .getClientAddresses()
            .then((clientAddressesPage) => {
                setIsLoading(false)
                setIsError(false)

                setClientAddresses(clientAddressesPage.content)

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
                                <h1 className="text-center">Sedi dei Clienti</h1>
                                <Alert variant={"primary"}>
                                    Qui trovi le sedi operative / cantieri dei tuoi clienti.
                                </Alert>
                            </Col>
                        </Row>

                        {/* table    */}
                        <Row>
                            <Col>

                                <Table striped bordered hover responsive>
                                    <thead>
                                    <tr>
                                        <th>Cliente</th>
                                        <th>Nome sede</th>
                                        <th>Indirizzo sede</th>
                                        <th>Azioni</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {clientAddresses.map(client => (
                                        // make this key unique
                                        <tr key={client.clientId + "" + client.addressId}>
                                            <td>{client.clientName}</td>
                                            <td>{client.addressName}</td>
                                            <td>{client.addressDisplayName}</td>
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