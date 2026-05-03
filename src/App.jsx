import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"

// import { useState, useEffect } from "react"
import {BrowserRouter, Routes, Route, Link} from "react-router-dom"
import { ProtectedRoute } from "./auth/ProtectedRoute.tsx"
import { PublicOnlyRoute } from "./auth/PublicOnlyRoute.tsx"
import { AuthGuard } from "./auth/AuthGuard.tsx"
import { AppRoutes } from "./js/my_types.ts"

// pages
import SeeMyProfilePage from "./components/pages/SeeMyProfilePage.tsx"
import EditMyProfilePage from "./components/pages/EditMyProfilePage.tsx"
import LoginPage from "./components/pages/LoginPage.tsx"
import HomePage from "./components/pages/HomePage.tsx"
import SignupPage from "./components/pages/SignupPage.tsx"
import AddMyArticlePage from "./components/pages/AddMyArticlePage.tsx"
import EditMyArticlePage from "./components/pages/EditMyArticlePage.tsx"
import SeeMyArticlesPage from "./components/pages/SeeMyArticlesPage.tsx"
import UploadCvPage from "./components/pages/UploadCVPage.tsx";
// standard pages
import NotFoundPage from "./components/pages/NotFoundPage.jsx"
import ForgotPasswordProvideEmailPage from "./components/pages/ForgotPasswordProvideEmailPage.tsx";
import ForgotPasswordSetNewPasswordPage from "./components/pages/ForgotPasswordSetNewPasswordPage.tsx";

// components
import AppNav from "./components/AppNav.tsx"
import AppFooter from "./components/AppFooter.tsx"
import AppSidebar from "./components/AppSidebar.tsx";
import {useAuth} from "./auth/AuthContext.tsx";
import {Col, Container, Row} from "react-bootstrap";
import DashboardPage from "./components/pages/DashboardPage.tsx";

function App() {

    const { login, logout, authenticated } = useAuth()

  return (
    <BrowserRouter>
      <AuthGuard>
        <header>
          <AppNav />
        </header>
        <main className={"d-flex flex-column"}>


            {/* sidebar */}
            {authenticated && (
                <Container id="sidebar">
                    <Row>
                        <Col >

                            <AppSidebar />

                        </Col>
                    </Row>
                </Container>
            )}


            <Container fluid id="page-without-sidebar" className={authenticated ? "has-sidebar" : ""}>
                <Row>

                    {/* "page" */}
                    <Col id="page">

                      {/* here go pages */}
                      <Routes>

                          <Route path="/" element={<HomePage />} />

                          <Route
                              path={AppRoutes.dashboard}
                              element={
                                  <ProtectedRoute>
                                      <DashboardPage />
                                  </ProtectedRoute>
                              }
                          />

                            <Route
                              path={AppRoutes.myProfile}
                              element={
                                <ProtectedRoute>
                                  <SeeMyProfilePage />
                                </ProtectedRoute>
                              }
                            />

                            <Route
                              path={AppRoutes.editMyProfile}
                              element={
                                <ProtectedRoute>
                                  <EditMyProfilePage />
                                </ProtectedRoute>
                              }
                            />

                            <Route
                              path={AppRoutes.myArticles}
                              element={
                                <ProtectedRoute>
                                  <SeeMyArticlesPage />
                                </ProtectedRoute>
                              }
                            />

                            <Route
                              path={AppRoutes.addMyArticle}
                              element={
                                <ProtectedRoute>
                                  <AddMyArticlePage />
                                </ProtectedRoute>
                              }
                            />

                            <Route
                              path={AppRoutes.editMyArticle}
                              element={
                                <ProtectedRoute>
                                  <EditMyArticlePage />
                                </ProtectedRoute>
                              }
                            />


                          <Route
                              path={AppRoutes.uploadCV}
                              element={
                                  <ProtectedRoute>
                                      <UploadCvPage />
                                  </ProtectedRoute>
                              }
                          />

                            <Route
                              path={AppRoutes.login}
                              element={
                                <PublicOnlyRoute>
                                  <LoginPage />
                                </PublicOnlyRoute>
                              }
                            />

                            <Route
                              path={AppRoutes.signup}
                              element={
                                <PublicOnlyRoute>
                                  <SignupPage />
                                </PublicOnlyRoute>
                              }
                            />


                          <Route
                              path={AppRoutes.forgotPasswordProvideEmail}
                              element={
                                  <PublicOnlyRoute>
                                      <ForgotPasswordProvideEmailPage />
                                  </PublicOnlyRoute>
                              }
                          />

                          <Route
                              path={AppRoutes.forgotPasswordSetNewPassword}
                              element={
                                  <PublicOnlyRoute>
                                      <ForgotPasswordSetNewPasswordPage />
                                  </PublicOnlyRoute>
                              }
                          />


                            <Route path="*" element={<NotFoundPage />} />
                          </Routes>

                    </Col>
                </Row>
            </Container>


        </main>
          {/*<footer>*/}
          {/*    <AppFooter />*/}
          {/*</footer>*/}
      </AuthGuard>
    </BrowserRouter>
  )
}

export default App
