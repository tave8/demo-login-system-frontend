import { useEffect, useState } from "react"
import { Container, Row, Col, Spinner, Alert, Button } from "react-bootstrap"
import { EnrichedArticleFromAPI } from "../../js/my_types"
import ArticlesAPI from "../../js/ArticlesAPI"
import { Link } from "react-router-dom"

const SeeMyArticlesPage = () => {
  const [articles, setArticles] = useState<EnrichedArticleFromAPI[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

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
        console.info("Error while getting articles")
        console.error(err)
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
            {/* articles list */}
            <Row className="g-3">
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
                              <Col xs={9}>
                                <span>{article.relativeTimeFormatted}</span>
                              </Col>
                              <Col className="text-end">
                                <Link className="btn btn-primary" to={`/my-articles/${article.articleId}/edit`}>
                                  Edit
                                </Link>
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

export default SeeMyArticlesPage
