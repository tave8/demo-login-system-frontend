import {Button, Card, Col, Container, Row} from "react-bootstrap";
import AddShiftForm from "../add_shift/AddShiftForm.tsx";
import {ShiftsCountByOperatorReportCard} from "./ShiftsCountByOperatorReportCard.tsx";
import {Example1ReportCard, ExampleReportCard} from "./Example1ReportCard.tsx";
import {Example2ReportCard} from "./Example2ReportCard.tsx";

export default function ReportsPage() {
    return (
        <Container fluid>
            <Row className="d-flex justify-content-center">
                <Col>

                    {/* page title */}
                    <Row className={"mb-3"}>
                        <Col>
                            <h1 className="text-center">Report</h1>
                        </Col>
                    </Row>

                    {/* report cards */}
                    <Row className={"d-flex g-3 row-cols-1 row-cols-sm-2 row-cols-lg-3"}>
                        {/* report: shifts count by operator */}
                        <Col>
                            <ShiftsCountByOperatorReportCard />
                        </Col>
                        <Col>
                            <Example1ReportCard />
                        </Col>
                        <Col>
                            <Example2ReportCard />
                        </Col>
                        {/* add new report here...   */}
                    </Row>

                </Col>
            </Row>
        </Container>
    )
}