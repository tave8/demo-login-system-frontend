import { useEffect, useState } from "react"
import { Container, Row, Col, Nav, Navbar, NavDropdown, Image, Dropdown, Form, InputGroup, Button, Spinner, Alert } from "react-bootstrap"
import { Search, BellFill } from "react-bootstrap-icons"
import { Link } from "react-router-dom"
import { ArticleFromAPI, ArticleToAPI, ArticlesPageFromAPI } from "../../js/my_types"
import UsersAPI from "../../js/UsersAPI"
import ArticlesAPI from "../../js/ArticlesAPI"

const SeeMyArticlesPage = () => {
  const [articles, setArticles] = useState<ArticleFromAPI[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  //   load my articles
  useEffect(() => {
    const articlesAPI = new ArticlesAPI<any, ArticlesPageFromAPI>()

    setIsLoading(true)
    setIsError(false)
    articlesAPI
      .getMyArticles()
      .then((articlesPageFromAPI) => {
        setIsLoading(false)
        setIsError(false)

        console.log(articlesPageFromAPI)

        const newArticles = articlesPageFromAPI.content

        setArticles(newArticles)

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
          <Col xs={12} md={9}>
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
                    <Col xs={12} md={6} key={article.articleId} className="border border-secondary">
                      <Row>
                        {/* article's title */}
                        <Col xs={12}>
                          <p>{article.title}</p>
                        </Col>
                        {/* article's content */}
                        <Col xs={12}>
                          <p>{article.content}</p>
                        </Col>
                      </Row>
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
