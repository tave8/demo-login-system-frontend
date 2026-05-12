import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"

// import { useState, useEffect } from "react"
import {BrowserRouter, Routes, Route, Link, Navigate} from "react-router-dom"
import { ProtectedRoute } from "./auth/ProtectedRoute.tsx"
import { PublicOnlyRoute } from "./auth/PublicOnlyRoute.tsx"
import { AuthGuard } from "./auth/AuthGuard.tsx"
import {AppRoutes, UserRole} from "./js/my_types.ts"

import SeeMyProfilePage from "./components/user_pages/SeeMyProfilePage.tsx"
import EditMyProfilePage from "./components/user_pages/EditMyProfilePage.tsx"
import LoginPage from "./components/auth_pages/LoginPage.tsx"
import SignupPage from "./components/auth_pages/SignupPage.tsx"
import AddMyArticlePage from "./components/user_pages/AddMyArticlePage.tsx"
import EditMyArticlePage from "./components/user_pages/EditMyArticlePage.tsx"
import SeeMyArticlesPage from "./components/user_pages/SeeMyArticlesPage.tsx"
import UploadCvPage from "./components/user_pages/UploadCVPage.tsx";
import NotFoundPage from "./components/NotFoundPage.jsx"
import ForgotPasswordProvideEmailPage from "./components/auth_pages/ForgotPasswordProvideEmailPage.tsx";
import ForgotPasswordSetNewPasswordPage from "./components/auth_pages/ForgotPasswordSetNewPasswordPage.tsx";
import AppNav from "./components/AppNav.tsx"
import {useAuth} from "./auth/AuthContext.tsx";
import {Col, Container, Row} from "react-bootstrap";
import AppToast from "./components/AppToast.tsx";
import {Helmet} from "react-helmet";
import LoginOperatorPage from "./components/auth_pages/LoginOperatorPage.tsx";
import UnauthorizedPage from "./components/UnauthorizedPage.jsx";
import UsersPage from "./components/user_pages/admin/UsersPage.tsx";
import AddUserPage from "./components/user_pages/admin/AddUserPage.tsx";
import ResetPasswordFirstLogin from "./components/auth_pages/ResetPasswordFirstLogin.tsx";
import {MustChangePasswordRoute} from "./auth/MustChangePasswordRoute.tsx";
import AdminDashboardPage from "./components/user_pages/admin/AdminDashboardPage.tsx";
import CoordinatorDashboardPage from "./components/user_pages/coordinator/CoordinatorDashboardPage.tsx";
import OperatorDashboardPage from "./components/user_pages/operator/OperatorDashboardPage.tsx";
import ClientsPage from "./components/user_pages/admin/ClientsPage.tsx";
import AddClientPage from "./components/user_pages/admin/AddClientPage.tsx";
import ClientAddressesPage from "./components/user_pages/admin/ClientAddressesPage.tsx";
import AddClientAddressPage from "./components/user_pages/admin/AddClientAddressPage.tsx";
import TasksPage from "./components/user_pages/admin/TasksPage.tsx";
import AddTaskPage from "./components/user_pages/admin/AddTaskPage.tsx";
import ChecklistsPage from "./components/user_pages/admin/ChecklistsPage.tsx";
import AddChecklistPage from "./components/user_pages/admin/AddChecklistPage.tsx";
import AddChecklistToClientAddressPage from "./components/user_pages/admin/AddChecklistToClientAddressPage.tsx";


function App() {

    const { login, logout, authenticated } = useAuth()


  return (
      <>
          <Helmet>
              <title>Operavion CRM</title>
          </Helmet>

          <AppToast />

        <BrowserRouter>
          <AuthGuard>
            <header>
              <AppNav />
            </header>
            <main className={"d-flex flex-column mb-5"}>


                <Container fluid className={"mt-3"}>
                    <Row>

                        {/* "page" */}
                        <Col id="page">

                          {/* here go user_pages */}
                          <Routes>

                              {/* redirect / -> dashboard */}
                              <Route path="/" element={<Navigate to={AppRoutes.login} replace />} />

                              {/* ************ START DASHBOARDS */}

                              {/* admin dashboard */}
                              <Route
                                  path={AppRoutes.dashboardOf(UserRole.ADMIN)}
                                  element={
                                      <ProtectedRoute allowOnlyRoles={[UserRole.ADMIN]}>
                                          <AdminDashboardPage />
                                      </ProtectedRoute>
                                  }
                              />

                              {/* coordinator dashboard */}
                              <Route
                                  path={AppRoutes.dashboardOf(UserRole.COORDINATOR)}
                                  element={
                                      <ProtectedRoute allowOnlyRoles={[UserRole.COORDINATOR]}>
                                          <CoordinatorDashboardPage />
                                      </ProtectedRoute>
                                  }
                              />

                              {/* operator dashboard */}
                              <Route
                                  path={AppRoutes.dashboardOf(UserRole.OPERATOR)}
                                  element={
                                      <ProtectedRoute allowOnlyRoles={[UserRole.OPERATOR]}>
                                          <OperatorDashboardPage />
                                      </ProtectedRoute>
                                  }
                              />

                              {/* ************ END DASHBOARDS */}


                              <Route
                                  path={AppRoutes.users}
                                  element={
                                      <ProtectedRoute allowOnlyRoles={[UserRole.ADMIN]}>
                                          <UsersPage />
                                      </ProtectedRoute>
                                  }
                              />

                              <Route
                                  path={AppRoutes.addUser}
                                  element={
                                      <ProtectedRoute allowOnlyRoles={[UserRole.ADMIN]}>
                                          <AddUserPage />
                                      </ProtectedRoute>
                                  }
                              />


                              <Route
                                  path={AppRoutes.clients}
                                  element={
                                      <ProtectedRoute allowOnlyRoles={[UserRole.ADMIN]}>
                                          <ClientsPage />
                                      </ProtectedRoute>
                                  }
                              />

                              <Route
                                  path={AppRoutes.addClient}
                                  element={
                                      <ProtectedRoute allowOnlyRoles={[UserRole.ADMIN]}>
                                          <AddClientPage />
                                      </ProtectedRoute>
                                  }
                              />

                              <Route
                                  path={AppRoutes.clientAddresses}
                                  element={
                                      <ProtectedRoute allowOnlyRoles={[UserRole.ADMIN]}>
                                          <ClientAddressesPage />
                                      </ProtectedRoute>
                                  }
                              />



                              <Route
                                  path={AppRoutes.addClientAddress}
                                  element={
                                      <ProtectedRoute allowOnlyRoles={[UserRole.ADMIN]}>
                                          <AddClientAddressPage />
                                      </ProtectedRoute>
                                  }
                              />


                              <Route
                                  path={AppRoutes.tasks}
                                  element={
                                      <ProtectedRoute allowOnlyRoles={[UserRole.ADMIN]}>
                                          <TasksPage />
                                      </ProtectedRoute>
                                  }
                              />


                              <Route
                                  path={AppRoutes.addTask}
                                  element={
                                      <ProtectedRoute allowOnlyRoles={[UserRole.ADMIN]}>
                                          <AddTaskPage />
                                      </ProtectedRoute>
                                  }
                              />


                              <Route
                                  path={AppRoutes.checklists}
                                  element={
                                      <ProtectedRoute allowOnlyRoles={[UserRole.ADMIN]}>
                                          <ChecklistsPage />
                                      </ProtectedRoute>
                                  }
                              />

                              <Route
                                  path={AppRoutes.addChecklist}
                                  element={
                                      <ProtectedRoute allowOnlyRoles={[UserRole.ADMIN]}>
                                          <AddChecklistPage />
                                      </ProtectedRoute>
                                  }
                              />


                              <Route
                                  path={AppRoutes.addChecklistToClientAddress}
                                  element={
                                      <ProtectedRoute allowOnlyRoles={[UserRole.ADMIN]}>
                                          <AddChecklistToClientAddressPage />
                                      </ProtectedRoute>
                                  }
                              />


                              {/*-----------------------------------*/}

                                <Route
                                  path={AppRoutes.myProfile}
                                  element={
                                    <ProtectedRoute allowAllRolesExcept={[UserRole.OPERATOR]}>
                                      <SeeMyProfilePage />
                                    </ProtectedRoute>
                                  }
                                />

                                <Route
                                  path={AppRoutes.editMyProfile}
                                  element={
                                    <ProtectedRoute allowAllRolesExcept={[UserRole.OPERATOR]}>
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

                                {/* PUBLIC ONLY ROUTES */}

                                <Route
                                  path={AppRoutes.login}
                                  element={
                                    <PublicOnlyRoute>
                                      <LoginPage />
                                    </PublicOnlyRoute>
                                  }
                                />

                              <Route
                                  path={AppRoutes.loginOperator}
                                  element={
                                      <PublicOnlyRoute>
                                          <LoginOperatorPage />
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


                              <Route
                                  path={AppRoutes.resetPasswordFirstLogin}
                                  element={
                                      <MustChangePasswordRoute>
                                          <ResetPasswordFirstLogin />
                                      </MustChangePasswordRoute>
                                  }
                              />

                                {/* unauthorized */}
                                <Route path={AppRoutes.unauthorized} element={<UnauthorizedPage />} />

                                {/* not found */}
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
      </>
  )
}

export default App
