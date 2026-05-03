import {Col, Container, Nav, Row} from "react-bootstrap";

const AppSidebar = () => {
    return (
        <>
            <Container fluid className={"bg-body-secondary"} style={{ minHeight: "100%" }}>
                <Row className={"d-flex flex-column"}>
                    <Col>
                        <p>Link 1</p>
                    </Col>
                    <Col>
                        <p>Link 2</p>

                    </Col>
                    <Col>
                        <p>Link 3</p>

                    </Col>
                    <Col>
                        <p>Link 4</p>

                    </Col>
                    <Col>
                        <p>Link 5</p>

                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default AppSidebar