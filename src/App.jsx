import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"

// import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
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
import NotFoundPage from "./components/pages/NotFoundPage.jsx"
// components
import AppNav from "./components/AppNav.tsx"
import AppFooter from "./components/AppFooter.tsx"

function App() {
  return (
    <BrowserRouter>
      <AuthGuard>
        <header>
          <AppNav />
        </header>
        <main className={"d-flex flex-column"}>
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* <Route path="/feed" element={<HomePage />} /> */}
            {/* <Route path="/articles/add" element={<HomePage />} /> */}

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
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <footer>
          <AppFooter />
        </footer>
      </AuthGuard>
    </BrowserRouter>
  )
}

export default App
