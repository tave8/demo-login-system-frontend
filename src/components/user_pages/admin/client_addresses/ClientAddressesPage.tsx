import {Alert, Button, Col, Container, Row, Table} from "react-bootstrap";
import UsersAPI from "../../../../js/api/UsersAPI.ts";
import {useEffect, useRef, useState} from "react";
import ArticlesAPI from "../../../../js/api/ArticlesAPI.ts";
import UnauthorizedError from "../../../../js/exceptions/UnauthorizedError.ts";
import {EnrichedClientAddressFromAPI, EnrichedClientFromAPI, EnrichedUserFromAPI} from "../../../../js/my_types.ts";
import ClientsAPI from "../../../../js/api/ClientsAPI.ts";
import ClientAddressesAPI from "../../../../js/api/ClientAddressesAPI.ts";
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet'
import L from 'leaflet'
// @ts-ignore
import 'leaflet/dist/leaflet.css'
import ClientAddressRow from "./ClientAddressRow.tsx";


const clientsAPI = ClientsAPI.getInstance()
const clientAddressesAPI = ClientAddressesAPI.getInstance()

export default function ClientAddressesPage() {
    const [clientAddresses, setClientAddresses] = useState<EnrichedClientAddressFromAPI[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)


    const center = [41.9028, 12.4964]  // Rom

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


    // ***********************
    // MAP
    // **********************

    const mapRef = useRef(null)

    useEffect(() => {

        // destroy existing map if present
        if (mapRef.current) {
            mapRef.current.remove()
            mapRef.current = null
        }


        const map = L.map('map').setView([41.9028, 12.4964], 5)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

        // for each client address, add marker and bind tooltip to it
        clientAddresses.forEach(address => {
            L.marker([address.addressLat, address.addressLon])
                .addTo(map)
                .bindTooltip(`${address.clientName} - ${address.addressDisplayName}`)
        })

        mapRef.current = map

        // cleanup on unmount
        return () => {
            if (mapRef.current) {
                mapRef.current.remove()
                mapRef.current = null
            }
        }

    }, [clientAddresses])




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
                                        <th>Aspettative di Contratto</th>
                                        <th>Azioni</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {clientAddresses.map(clientAddress => (

                                        <ClientAddressRow
                                            key={clientAddress.clientId + "" + clientAddress.addressId}
                                            clientAddress={clientAddress}
                                        />

                                    ))}
                                    </tbody>
                                </Table>
                            </Col>

                        </Row>

                        {/* map of client addresses    */}
                        <Row>
                            <div id="map" style={{ height: "400px", width: "100%" }} />
                        </Row>

                    </Col>
                </Row>
            </Container>
        </>
    )
}