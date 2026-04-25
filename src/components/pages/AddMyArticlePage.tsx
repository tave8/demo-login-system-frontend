import { useState } from "react"
import { Container, Row, Col, Form, Button } from "react-bootstrap"
import { ArticleToAPI } from "../../js/my_types"
import ArticlesAPI from "../../js/ArticlesAPI"

interface handleAddArticleParams {}

const initialArticleData: ArticleToAPI = {
  title: "",
  content: "",
}

const AddMyArticlePage = () => {
  const [articleData, setArticleData] = useState(initialArticleData)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useState(() => {}, [])

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

const handleAddArticle = (newArticleData: ArticleToAPI) => {
  return async () => {
    const articlesAPI = new ArticlesAPI()

    articlesAPI
      .addMyArticle(newArticleData)
      .then((articleData) => {
        // console.log(articleData)
        alert("successfully added article")
      })
      .catch((err) => {
        console.info("Error during login")
        console.error(err)
      })
  }
}

export default AddMyArticlePage
