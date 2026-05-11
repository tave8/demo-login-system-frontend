import {Col, Container, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../js/my_types.ts";
import {useAuth} from "../auth/AuthContext.tsx";

const NotFoundPage = () => {

    const {user} = useAuth()

    const navigate = useNavigate()

  return (
    <>
        <Container className={"mt-3"}>
            <Row>
                <Col className={"text-center"}>

                    <h2>This page does not exist</h2>

                    <h3><a href={"#"} onClick={() => {

                        // user does not exist
                        if(user == null) {

                            navigate(AppRoutes.login)

                        } else {
                            navigate(AppRoutes.dashboardOf(user.role))
                        }


                    }}>Go back</a></h3>

                </Col>
            </Row>
        </Container>
    </>
  )
}

export default NotFoundPage
