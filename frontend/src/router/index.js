import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import Login from "../pages/Login"
import Register from "../pages/Register"
import Profile from "../pages/Profile"
import SurverList from "../pages/SurveyList"
import Layout from "../layout/layout"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

const AppRouter = () => {
  return (
    <Router>
      <AuthHandler />
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/surverList" element={<SurverList />} />
        </Routes>
      </Layout>
    </Router>
  )
}

// authentication user info before entering the route
const AuthHandler = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)


  const currentPath = window.location.pathname

  useEffect(() => {
    const isAuthenticated = !!user?.token /* your authentication logic here */
    if (!isAuthenticated && currentPath !== "/login" && currentPath !== "/register") {
      navigate("/login")
    }
  }, [navigate, user, currentPath])

  return null
}

export default AppRouter
