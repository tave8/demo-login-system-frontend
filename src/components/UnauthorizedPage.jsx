import {Col, Container, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../js/my_types.ts";

export default function UnauthorizedPage() {

    const navigate = useNavigate()

  return (
    <>
        <Container className={"mt-3"}>
            <Row>
                <Col className={"text-center"}>

                    <h2>You are not authorized to access this resource</h2>

                    <h3><a href={"#"} onClick={() => {

                        navigate(AppRoutes.dashboard)

                    }}>Go back</a></h3>

                </Col>
            </Row>
        </Container>
    </>
  )
}
