import { useState } from "react"
import { Container, Row, Col, Form, Button, Spinner, Alert } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import { AppRoutes, ArticleFromAPI, ArticleToAPI } from "../../js/my_types"
import ArticlesAPI from "../../js/ArticlesAPI"

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
    const articleId = params.articleId
    // if no articleId was found
    if (!articleId) {
      navigate(AppRoutes.myArticles)
      return
    }
    const articlesAPI = new ArticlesAPI()

    setIsLoading(true)
    setIsError(false)
    articlesAPI
      .getMyArticleById(articleId)
      .then((articleFromAPI) => {
        setIsLoading(false)
        setIsError(false)

        setArticle(articleFromAPI)
        // console.log(articleFromAPI)

        // console.log(articlesPage)
      })
      .catch((err) => {
        setIsLoading(false)
        setIsError(true)
        console.info("Error while getting article")
        console.error(err)
      })

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
                <h1 className="text-center">Edit article</h1>
              </Col>
            </Row>

            {/* my article */}

            {/* {!isLoading && !isError && ( */}
            <>
              {/* article's title */}
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Type the article's title"
                      value={article.title}
                      onChange={(event) => {
                        setArticle({
                          ...article,
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
                      value={article.content}
                      onChange={(event) => {
                        setArticle({
                          ...article,
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
                      //   handleAddArticle(articleData)()
                    }}
                  >
                    Add article
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
