import { useState } from "react"
import { Container, Row, Col, Nav, Navbar, NavDropdown, Image, Dropdown, Form, InputGroup, Button, Spinner, Alert } from "react-bootstrap"
import { Search, BellFill } from "react-bootstrap-icons"
import { Link } from "react-router-dom"
import { ArticleToAPI, ArticleFromAPI } from "../../js/my_types"
import UsersAPI from "../../js/UsersAPI"

interface handleAddArticleParams {}

const initialArticleData: ArticleToAPI = {
  title: "",
  content: "",
}

const AddArticlePage = () => {
  const [articleData, setArticleData] = useState(initialArticleData)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  // fetch user data each time
  // the component is rendered
  useState(() => {
    // const usersAPI = new UsersAPI<UpdatedUserToAPI, UserFromAPI>()
    // setIsLoading(true)
    // setIsError(false)
    // usersAPI
    //   .getMyInfo()
    //   .then((userData) => {
    //     setIsLoading(false)
    //     setIsError(false)
    //     setUserData(userData)
    //     // console.log(userData)
    //   })
    //   .catch((err) => {
    //     setIsLoading(false)
    //     setIsError(true)
    //     console.info("Error during getting user info")
    //     console.error(err)
    //   })
  }, [])

  return (
    <>
      <Container fluid>
        <Row className="d-flex justify-content-center">
          <Col xs={12} md={6}>
            {/* page's title */}
            <Row className="mb-3">
              <Col>
                <h1 className="text-center">Add article</h1>
              </Col>
            </Row>
            {/* article's title */}
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Type the article's title"
                    value={articleData.title}
                    onChange={(event) => {
                      setArticleData({
                        ...articleData,
                        title: event.target.value,
                      })
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            {/* article's content */}
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Type the article's content"
                    value={articleData.content}
                    onChange={(event) => {
                      setArticleData({
                        ...articleData,
                        content: event.target.value,
                      })
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            {/* submit/add article */}
            <Row>
              <Col className="text-center">
                <Button
                  className="btn btn-primary"
                  onClick={() => {
                    handleAddArticle(articleData)()
                  }}
                >
                  Add article
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}

const handleAddArticle = (articleData: ArticleToAPI) => {
  return async () => {
    console.log(articleData)
    // const usersAPI = new UsersAPI<UpdatedUserToAPI, UserFromAPI>()

    // usersAPI
    //   .updateMyInfo(updatedUserData)
    //   .then((userData) => {
    //     console.log(userData)
    //     alert("successfully update my info")
    //   })
    //   .catch((err) => {
    //     console.info("Error during login")
    //     console.error(err)
    //   })
  }
}

export default AddArticlePage
