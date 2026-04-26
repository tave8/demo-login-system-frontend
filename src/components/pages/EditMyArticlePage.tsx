import { useState } from "react"
import { Container, Row, Col, Form, Button, Spinner, Alert } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import { AppRoutes, ArticleFromAPI, EnrichedArticleFromAPI, UpdatedArticleToAPI } from "../../js/my_types"
import ArticlesAPI from "../../js/ArticlesAPI"

interface handleEditMyArticleParams {
  setArticle: (article: EnrichedArticleFromAPI) => void
  setUpdatedArticle: (updatedArticle: UpdatedArticleToAPI) => void
}

type RouteURLParams = {
  articleId: string
}

const initialArticle: EnrichedArticleFromAPI = {
  articleId: "",
  title: "",
  content: "",
  coverUrl: "",
  createdAt: "",
  relativeTimeFormatted: ""
}

const initialUpdatedArticle: UpdatedArticleToAPI = {
  title: "",
  content: "",
}

const EditMyArticlePage = () => {
  const [article, setArticle] = useState(initialArticle)
  const [updatedArticle, setUpdatedArticle] = useState(initialUpdatedArticle)
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
      .getMyArticleByIdEnriched(articleId)
      .then((articleFromAPI) => {
        setIsLoading(false)
        setIsError(false)

        setArticle(articleFromAPI)

        // populate updated article
        setUpdatedArticle({
          title: articleFromAPI.title,
          content: articleFromAPI.content,
        })
      })
      .catch((err) => {
        setIsLoading(false)
        setIsError(true)
        console.info("Error while updating article")
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

            {!isLoading && !isError && (
              <>
                {/* article's metadata */}
                <Row>
                  <Col>
                    <Row>
                      <Col xs={9}>
                        <span>{article.relativeTimeFormatted}</span>
                      </Col>
                    </Row>
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
                        value={updatedArticle.title}
                        onChange={(event) => {
                          setUpdatedArticle({
                            ...updatedArticle,
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
                        value={updatedArticle.content}
                        onChange={(event) => {
                          setUpdatedArticle({
                            ...updatedArticle,
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
                        handleEditMyArticle(article.articleId, updatedArticle)({ setArticle, setUpdatedArticle })
                      }}
                    >
                      Edit article
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

const handleEditMyArticle = (articleId: string, updatedArticle: UpdatedArticleToAPI) => {
  return async (params: handleEditMyArticleParams) => {
    const { setArticle, setUpdatedArticle } = params

    // console.log(articleId, updatedArticle)
    const articlesAPI = new ArticlesAPI()
    articlesAPI
      .updateMyArticleByIdEnriched(articleId, updatedArticle)
      .then((articleFromAPI) => {
        setArticle(articleFromAPI)
        setUpdatedArticle({
          title: articleFromAPI.title,
          content: articleFromAPI.content,
        })
        // console.log(article)
        alert("successfully updated article")
      })
      .catch((err) => {
        console.info("Error during update article")
        console.error(err)
      })
  }
}

export default EditMyArticlePage
