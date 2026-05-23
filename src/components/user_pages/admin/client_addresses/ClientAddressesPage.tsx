import {Alert, Button, Col, Container, Modal, Row, Table} from "react-bootstrap";
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
import {InfoCircleFill, QuestionCircle, XLg} from "react-bootstrap-icons";

// fix: leaflet prefixes the markers/icons with local path,
// but once deployed remote, it breaks. solution:
// we must create our own custom icon, pointing to a CDN
export const safeLeafletIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],         // Standard Leaflet icon dimensions
    iconAnchor: [12, 41],       // Point of the icon which will correspond to marker's location
    popupAnchor: [1, -34],      // Point from which the popup should open relative to the iconAnchor
    shadowSize: [41, 41]        // Standard shadow dimensions
});


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
            L.marker([address.addressLat, address.addressLon], { icon: safeLeafletIcon })
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


    // ***********************
    // MODAL THAT EXPLAINS "CONTRACT EXPECTATIONS"
    // **********************

    // 1. Define the visibility state (starts as closed/false)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // 2. Helper functions to mutate the state
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);


    return (
        <>
            <Container fluid>
                <Row className="d-flex justify-content-center">
                    <Col xs={12} md={9}>

                        {/* title */}
                        <Row className={"mb-3"}>
                            <Col>
                                <h1 className="text-center">Cantieri</h1>
                                <Alert variant={"primary"}>
                                    Qui trovi i cantieri dei tuoi clienti.
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
                                        <th
                                            onClick={openModal}
                                            style={{ cursor: 'pointer', userSelect: 'none' }}
                                        >
                                            <div className="d-flex align-items-center gap-1">
                                                <span>Aspettative <br/> di Contratto</span>
                                                <QuestionCircle size={14} className="text-muted" />
                                            </div>
                                        </th>
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
                        <Row className={"mt-5"}>
                            <div id="map" style={{ height: "400px", width: "100%" }} />
                        </Row>

                    </Col>
                </Row>


                <Modal show={isModalOpen} onHide={closeModal} centered>
                    <Modal.Header className="align-items-center justify-content-between">
                        <Modal.Title className="d-flex align-items-center gap-2" style={{ fontSize: '1.15rem' }}>
                            <InfoCircleFill className="text-primary" size={20} />
                            <span className="fw-bold">Cosa sono le Aspettative?</span>
                        </Modal.Title>
                        <Button variant="link" className="text-dark p-0" onClick={closeModal}>
                            <XLg size={16} />
                        </Button>
                    </Modal.Header>

                    <Modal.Body style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                        <p>
                            Le <strong>Aspettative di Contratto</strong> rappresentano gli obblighi
                            contrattuali che riguardano i turni, orari e preferenze del cliente in un dato cantiere.
                            Per notificarti di cosa manca nel tuo account aziendale di ZeroChiamate che invece è scritto nel contratto,
                            l'Intelligenza Artificiale calcola la differenza
                            tra "quello è scritto contrattualmente" e "quello che hai effettivamente inserito in ZeroChiamate".
                            Avere un sistema automatizzato che rileva queste discrepanze
                            riduce i clienti insoddisfatti e migliora l'operatività giornaliera, permettendoti di concencentrarti
                            più sulla crescita.
                        </p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="primary" size="sm" onClick={closeModal}>
                            Ho capito
                        </Button>
                    </Modal.Footer>
                </Modal>

            </Container>
        </>
    )
}