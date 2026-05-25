import {useState} from "react"
import {Alert, Button, Col, Container, Image, Row, Spinner} from "react-bootstrap"
import {Link} from "react-router-dom"
import {AppEvent, AppEventMessageType, AppRoutes, type UserFromAPI} from "../../js/my_types"
import UsersAPI from "../../js/api/UsersAPI"
import {useAuth} from "../../auth/AuthContext"
import UnauthorizedError from "../../js/exceptions/UnauthorizedError"
import BillingAPI from "../../js/api/BillingAPI.ts";
import AppEventDispatcher from "../../js/AppEventDispatcher.ts";


const billingAPI = BillingAPI.getInstance()
const appEventDispatcher = AppEventDispatcher.getInstance()


const initialUserData: UserFromAPI = {
  firstname: "",
  lastname: "",
  email: "",
  avatarUrl: "",
}

const SeeMyProfilePage = () => {
  const [userData, setUserData] = useState(initialUserData)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const { logout } = useAuth()

  // fetch user data each time
  // the component is rendered
  useState(() => {
    const usersAPI = new UsersAPI()

    setIsLoading(true)
    setIsError(false)
    usersAPI
      .getMyInfo()
      .then((userData) => {
        setIsLoading(false)
        setIsError(false)
        setUserData(userData)
        // console.log(userData)
      })
      .catch((err) => {
        setIsLoading(false)
        setIsError(true)
        if (err instanceof UnauthorizedError) {
          logout()
        }
      })
  }, [])


    /**
     * When user clicks to create a new billing subscription.
     *
     * @param e
     */
    const handleBillingCheckout = (e: React.MouseEvent<HTMLButtonElement>) =>
    {

        billingAPI
            .createCheckout()
            .then((checkoutFromAPI) => {

                const checkoutUrl = checkoutFromAPI.checkoutUrl

                // redirect user to checkout
                window.location.href = checkoutUrl;

            })
            .catch((err: Error) => {

                appEventDispatcher.dispatchStandard(
                    AppEvent.APP_ERROR,
                    AppEventMessageType.BAD_REQUEST
                )

            })


    }


  /**
   * When user clicks to go to their Billing Portal.
   *
   * @param e
   */
  const handleBillingPortal = (e: React.MouseEvent<HTMLButtonElement>) =>
  {

    billingAPI
        .createBillingPortal()
        .then((billingPortalFromAPI) => {

            const portalUrl = billingPortalFromAPI.portalUrl

            // redirect user to portal
            window.location.href = portalUrl;

        })
        .catch((err: Error) => {

            appEventDispatcher.dispatchStandard(
                AppEvent.APP_ERROR,
                AppEventMessageType.BAD_REQUEST
            )

        })


  }

  return (
    <>
      <Container fluid>
        <Row className="d-flex justify-content-center">
          <Col xs={12} md={9} lg={6}>
            {/* title */}
            <Row className="mb-3">
              <Col>
                <h1 className="text-center">Il mio profilo</h1>
              </Col>
            </Row>

            {/* my profile info */}

            {!isLoading && !isError && (
              <>
                <Row className="g-3 align-items-center">

                  <Col xs={12} md={3} className="text-center">
                    <Image src={userData.avatarUrl} roundedCircle style={{ width: "120px", height: "120px", objectFit: "cover" }} />
                  </Col>

                  <Col md={9}>
                    <p className="fs-4 mb-1">
                      {userData.firstname} {userData.lastname}
                    </p>
                    <p className="text-muted mb-0">{userData.email}</p>
                  </Col>

                  {/*  handle existing billing subscription */}
                  <Col xs={12}>
                    <p><Button onClick={(e) => {
                      handleBillingPortal(e)
                    }}>Gestisci iscrizione</Button></p>
                  </Col>

                {/*  create new billing subscription */}
                <Col xs={12}>
                    <p><Button onClick={(e) => {
                        handleBillingCheckout(e)
                    }}>Pagamento iscrizione</Button></p>
                </Col>

                </Row>

                {/* submit  */}
                <Row className="mt-3">
                  <Col xs={12} className="text-center">
                    <Link to={AppRoutes.editMyProfile} className="btn btn-primary">
                      Modifica profilo
                    </Link>
                  </Col>
                </Row>

              </>
            )}

            {/* is loading */}
            {isLoading && (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            )}

            {/* is error */}
            {isError && <Alert variant="danger">Something went wrong.</Alert>}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default SeeMyProfilePage
