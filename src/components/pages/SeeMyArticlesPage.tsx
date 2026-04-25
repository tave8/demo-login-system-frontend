import { useEffect, useState } from "react"
import { Container, Row, Col, Nav, Navbar, NavDropdown, Image, Dropdown, Form, InputGroup, Button, Spinner, Alert } from "react-bootstrap"
import { Search, BellFill } from "react-bootstrap-icons"
import { Link } from "react-router-dom"
import { ArticleFromAPI, ArticleToAPI, ArticlesPageFromAPI } from "../../js/my_types"
import UsersAPI from "../../js/UsersAPI"
import ArticlesAPI from "../../js/ArticlesAPI"

interface handleAddArticleParams {}

const SeeMyArticlesPage = () => {
  const [articles, setArticles] = useState<ArticleFromAPI[]>([])

  //   load my articles
  useEffect(() => {
    // const fakeArticle1: ArticleFromAPI = {
    //   title: "fake title 1",
    //   content: "fake content 1",
    //   coverUrl: "",
    //   articleId: "a",
    //   createdAt: "",
    // }
    // const fakeArticle2: ArticleFromAPI = {
    //   title: "fake title 2",
    //   content: "fake content 2",
    //   coverUrl: "",
    //   articleId: "b",
    //   createdAt: "",
    // }

    // const fakeArticles: ArticleFromAPI[] = [fakeArticle1, fakeArticle2]

    // setArticles(fakeArticles)
    const articlesAPI = new ArticlesAPI<any, ArticlesPageFromAPI>()

    articlesAPI
      .getMyArticles()
      .then((articlesPageFromAPI) => {
        console.log(articlesPageFromAPI)

        const newArticles = articlesPageFromAPI.content

        setArticles(newArticles)

        // alert("successfully added article")
      })
      .catch((err) => {
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
              {articles.map((article) => {
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
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default SeeMyArticlesPage
