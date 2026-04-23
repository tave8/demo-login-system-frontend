import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"

// import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

// pages
import SeeMyProfilePage from "./components/pages/SeeMyProfilePage.tsx"
import EditMyProfilePage from "./components/pages/EditMyProfilePage.tsx"
import LoginPage from "./components/pages/LoginPage.tsx"
import HomePage from "./components/pages/HomePage.tsx"
import SignupPage from "./components/pages/SignupPage.tsx"
// components
import MyNav from "./components/MyNav.tsx"
import MyFooter from "./components/MyFooter.tsx"

function App() {
  return (
    <BrowserRouter>
      <header>
        <MyNav />
      </header>
      <main className={"d-flex flex-column"}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/feed" element={<HomePage />} /> */}
          {/* <Route path="/articles/add" element={<HomePage />} /> */}
          <Route path="/me" element={<SeeMyProfilePage />} />
          <Route path="/me/edit" element={<EditMyProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </main>
      <footer>
        <MyFooter />
      </footer>
    </BrowserRouter>
  )
}

export default App
