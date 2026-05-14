import {useState} from "react";
import {Alert, Button, Col, Container, Form, ListGroup, Row, Spinner} from "react-bootstrap";
import {
    AppEvent,
    AppEventMessageType, AppRoutes,
    ClientToAPI,
    EnrichedGeocodingAutocompleteItemFromAPI
} from "../../../../js/my_types.ts";

import AddShiftForm from "./AddShiftForm.tsx";




export default function AddShiftPage () {

    return (
        <Container fluid>
            <Row className="d-flex justify-content-center">
                <Col>

                    {/* page title */}
                    <Row className={"mb-3"}>
                        <Col>
                            <h1 className="text-center">Aggiungi Turno</h1>
                        </Col>
                    </Row>

                    {/* fields */}
                    <Row>
                        <Col>
                            <AddShiftForm />
                        </Col>
                    </Row>

                </Col>
            </Row>
        </Container>
    )
}
