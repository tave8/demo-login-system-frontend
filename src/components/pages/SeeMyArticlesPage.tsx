import { useEffect, useState } from "react"
import { Container, Row, Col, Spinner, Alert, Button } from "react-bootstrap"
import { AppRoutes, EnrichedArticleFromAPI } from "../../js/my_types"
import ArticlesAPI from "../../js/api/ArticlesAPI"
import { Link } from "react-router-dom"
import UnauthorizedError from "../../js/exceptions/UnauthorizedError"
import { useAuth } from "../../auth/AuthContext"

interface handleDeleteMyArticleParams {
  articles: EnrichedArticleFromAPI[]
  setArticles: (articles: EnrichedArticleFromAPI[]) => void
  logout: () => void
}

const SeeMyArticlesPage = () => {
  const [articles, setArticles] = useState<EnrichedArticleFromAPI[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const { login, logout, authenticated } = useAuth()

  //   load my articles
  useEffect(() => {
    const articlesAPI = new ArticlesAPI()

    setIsLoading(true)
    setIsError(false)
    articlesAPI
      .getMyArticlesEnriched()
      .then((articlesPage) => {
        setIsLoading(false)
        setIsError(false)

        // console.log(articlesPage)

        setArticles(articlesPage.content)

        // alert("successfully added article")
      })
      .catch((err) => {
        setIsLoading(false)
        setIsError(true)
        if (err instanceof UnauthorizedError) {
          logout()
          // console.log("you are unauthorized!")
          // console.log(err)
        } else {
          console.info("Error while getting articles")
          console.error(err)
        }
      })
  }, [])

  return (
    <>
      <Container fluid>
        <Row className="d-flex justify-content-center">
          <Col xs={12} lg={9}>
            {/* page's title */}
            <Row className="mb-3">
              <Col>
                <h1 className="text-center">My articles</h1>
              </Col>
            </Row>
            <Row className="g-3">
              {/* articles list */}
              {!isLoading &&
                !isError &&
                articles.map((article) => {
                  return (
                    // each col represents an article
                    <Col xs={12} md={6} key={article.articleId}>
                      {/* this div is for internal spacing, 
                        without affecting the spacing at the layout level  */}
                      <div className="border border-secondary-subtle rounded-1 p-3">
                        {/* each col inside this row, should represent 
                            an horizontal space (row) */}
                        <Row>
                          <Col xs={12}>
                            <Row>
                              <Col xs={6}>
                                <span className="fw-light">{article.relativeTimeFormatted}</span>
                              </Col>
                              <Col className="text-end">
                                {/* edit button */}
                                <Link className="btn btn-primary" to={AppRoutes.editMyArticleWith(article.articleId)}>
                                  Edit
                                </Link>
                                {/* delete button */}
                                <Button
                                  variant="danger"
                                  onClick={() => {
                                    const answerIsYes: boolean = confirm("Are you sure you want to delete this article?")
                                    if (!answerIsYes) {
                                      return
                                    }
                                    handleDeleteMyArticle(article.articleId)({ setArticles, articles, logout })
                                  }}
                                >
                                  Delete
                                </Button>
                              </Col>
                            </Row>
                          </Col>
                          {/* article's title */}
                          <Col xs={12}>
                            <p className="fs-3">{article.title}</p>
                          </Col>
                          {/* article's content */}
                          <Col xs={12}>
                            <p>{article.content}</p>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  )
                })}

              {/* no articles */}
              {!isLoading && !isError && articles.length == 0 && (
                <p className="text-center">
                  No articles yet. <Link to={AppRoutes.addMyArticle}>Add your first.</Link>
                </p>
              )}

              {/* is loading */}
              {isLoading && (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              )}

              {/* is error */}
              {isError && <Alert variant="danger">Something went wrong.</Alert>}
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}

const handleDeleteMyArticle = (targetArticleId: string) => {
  return async (params: handleDeleteMyArticleParams) => {
    const { setArticles, articles, logout } = params

    const articlesAPI = new ArticlesAPI()
    articlesAPI
      .deleteMyArticleById(targetArticleId)
      .then(() => {
        const articlesWithoutDeleted = articles.filter((article) => article.articleId != targetArticleId)

        setArticles(articlesWithoutDeleted)

        alert("successfully deleted article")
      })
      .catch((err) => {
        if (err instanceof UnauthorizedError) {
          logout()
          // console.log("you are unauthorized!")
          // console.log(err)
        } else {
          console.info("Error during delete article")
          console.error(err)
        }
      })
  }
}

export default SeeMyArticlesPage
