import { useState } from "react"
import { Container, Row, Col, Form, Button, Spinner, Alert } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import { ArticleFromAPI, ArticleToAPI } from "../../js/my_types"

// interface handleLoginParams {}

type RouteURLParams = {
    articleId: string 
}

const initialArticle: ArticleToAPI = {
  title: "",
  content: "",
}

const EditMyArticlePage = () => {
  const [article, setArticle] = useState(initialArticle)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const params = useParams<RouteURLParams>()
  const navigate = useNavigate()

  // fetch the article each time
  // the component is rendered
  useState(() => {
    // if no articleId was found
    if(!params.articleId) {
        navigate()
        return 
    }
    // get the article ID
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

            {/* {!isLoading && !isError && ( */}
            <>
              <Row className="g-3">
                <Col xs={12} md={3} className="text-center">
                  {/* <Image src={userData.avatarUrl} /> */}
                </Col>
                <Col md={9}>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Firstname</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="My firstname"
                      // value={userData.firstname}
                      onChange={(event) => {
                        //   setUserData({
                        //     ...userData,
                        //     firstname: event.target.value,
                        //   })
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Lastname</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="My lastname"
                      // value={userData.lastname}
                      onChange={(event) => {
                        //   setUserData({
                        //     ...userData,
                        //     lastname: event.target.value,
                        //   })
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
                      // handleEditProfile(userData)()
                    }}
                  >
                    Edit my profile
                  </Button>
                </Col>
              </Row>
            </>
            {/* )} */}

            {/* is loading */}
            {/* {isLoading && (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner> */}
            {/* )} */}

            {/* is error */}
            {/* {isError && <Alert variant="danger">Something went wrong.</Alert>} */}
          </Col>
        </Row>
      </Container>
    </>
  )
}

// const handleEditProfile = (updatedUserData: UpdatedUserToAPI) => {
//   return async () => {
//     const usersAPI = new UsersAPI<UpdatedUserToAPI, UserFromAPI>()

//     usersAPI
//       .updateMyInfo(updatedUserData)
//       .then((userData) => {
//         console.log(userData)
//         alert("successfully update my info")
//       })
//       .catch((err) => {
//         console.info("Error during login")
//         console.error(err)
//       })
//   }
// }

export default EditMyArticlePage
