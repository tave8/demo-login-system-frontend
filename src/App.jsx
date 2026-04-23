import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"

// import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

// pages
import SeeMyProfilePage from "./components/pages/SeeMyProfilePage"
import EditMyProfilePage from "./components/pages/EditMyProfilePage"
import LoginPage from "./components/pages/LoginPage"
import HomePage from "./components/pages/HomePage"
import SignupPage from "./components/pages/SignupPage"
// components
import MyNav from "./components/MyNav"
import MyFooter from "./components/MyFooter"

function App() {
  return (
    <BrowserRouter>
      <header>
        <MyNav />
      </header>
      <main className={"d-flex flex-column"}>
        <Routes>
          <Route path="/" element={<HomePage />} />
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
