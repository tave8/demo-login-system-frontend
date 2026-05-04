import { useState } from "react"
import { Container, Row, Col, Form, Button, Spinner, Alert, Image } from "react-bootstrap"
import {AppEvent, AppEventMessage, UpdatedUserToAPI, UserFromAPI} from "../../js/my_types"
import UsersAPI from "../../js/api/UsersAPI"
import UnauthorizedError from "../../js/exceptions/UnauthorizedError"
import { useAuth } from "../../auth/AuthContext"
import FileHelper from "../../js/helpers/FileHelper"
import InvalidFileUploadedError from "../../js/exceptions/InvalidFileUploadedError"
import AppEventDispatcher from "../../js/AppEventDispatcher.ts";


const appEventDispatcher: AppEventDispatcher = AppEventDispatcher.getInstance()

type MaybeFile = File | null

interface handleEditProfileParams {
  logout: () => void
}

const initialUserData: UserFromAPI = {
  firstname: "",
  lastname: "",
  email: "",
  avatarUrl: "",
}

interface HandleUploadAvatarImageParams {
  setUserData: (u: UserFromAPI) => void
  setIsLoading: (x: boolean) => void
  setIsError: (x: boolean) => void
  logout: () => void
}

const EditMyProfilePage = () => {
  const [userData, setUserData] = useState(initialUserData)
  const [avatarImage, setAvatarImage] = useState<MaybeFile>()
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

  return (
    <>
      <Container fluid>
        <Row className="d-flex justify-content-center">
          <Col xs={12} md={9} lg={6}>
            {/* title */}
            <Row className="mb-3">
              <Col>
                <h1 className="text-center">Edit my profile</h1>
              </Col>
            </Row>

            {/* my profile info */}

            {!isLoading && !isError && (
              <>
                <Row className="g-3">
                  <Col xs={12} className="text-center">
                    <Row className="d-flex flex-column align-items-center g-3">
                      <Col>
                        {/* avatar image */}
                        <Image src={userData.avatarUrl} roundedCircle style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                      </Col>
                      <Col xs={12} className="text-center">
                        {/* avatar image upload */}
                        <Form.Group className="mb-3">
                          <Form.Control
                            type="file"
                            size="sm"
                            accept="image/*"
                            onChange={(event) => {
                              const file: MaybeFile = event.target.files?.[0]
                              if (file) {
                                setAvatarImage(file)
                                handleUploadAvatarImage(file)({ setUserData, setIsLoading, setIsError, logout })
                              }
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>Firstname</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="My firstname"
                        value={userData.firstname}
                        onChange={(event) => {
                          setUserData({
                            ...userData,
                            firstname: event.target.value,
                          })
                        }}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>Lastname</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="My lastname"
                        value={userData.lastname}
                        onChange={(event) => {
                          setUserData({
                            ...userData,
                            lastname: event.target.value,
                          })
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col xs={12} className="text-center">
                    <Button
                      className="btn btn-primary"
                      onClick={() => {
                        handleEditProfile(userData)({ logout })
                      }}
                    >
                      Edit my profile
                    </Button>
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

const handleEditProfile = (updatedUser: UpdatedUserToAPI) => {
  return async (params: handleEditProfileParams) => {
    const { logout } = params

    const usersAPI = new UsersAPI()

    usersAPI
      .updateMyInfo(updatedUser)
      .then((userData) => {

        appEventDispatcher.dispatch(
            AppEvent.APP_SUCCESS,
            AppEventMessage.SAVED_SUCCESS
        )

      })
      .catch((err) => {
        if (err instanceof UnauthorizedError) {
          logout()
        }
      })
  }
}

const handleUploadAvatarImage = (image: File) => {
  return async (params: HandleUploadAvatarImageParams) => {
    const { setIsError, setIsLoading, setUserData, logout } = params

    // check that image passes all checks
    try {
      FileHelper.requireValidAvatarImage(image)
    } catch (err) {
      if (err instanceof InvalidFileUploadedError) {
        // ideally, you could clean the input field here
        alert(err.message)
      }
      // if we ever enter the catch block, we stop
      return
    }

    // all checks passed, now we can upload the image

    const usersAPI = new UsersAPI()

    setIsLoading(true)
    setIsError(false)
    usersAPI
      .uploadMyAvatarImage(image)
      .then((userData) => {
        setIsLoading(false)
        setIsError(false)
        setUserData(userData)
      })
      .catch((err) => {
        setIsLoading(false)
        setIsError(true)
        if (err instanceof UnauthorizedError) {
          logout()
        }
      })
  }
}

export default EditMyProfilePage
