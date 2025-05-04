import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import Login from "../pages/Login"
import WelcomePage from "../pages/WelCome.jsx"
import Register from "../pages/Register"
import Profile from "../pages/Profile"
import SurveyList from "../pages/SurveyList"
import Survey from "../pages/Survey"
import Voting from "../pages/Voting"
import VotingComplete from "../pages/Voting/VotingComplete.jsx"
import Success from "../pages/Survey/success.jsx"
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
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/surveyList" element={<SurveyList />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/surveySuccess" element={<Success />} />
          <Route path="/voting-complete" element={<VotingComplete />} />
          <Route path="/voting" element={<Voting />} />
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
    if (
      !isAuthenticated &&
      currentPath !== "/login" &&
      currentPath !== "/register" &&
      currentPath !== "/survey" &&
      currentPath !== "/voting" &&
      currentPath !== "/surveySuccess"
    ) {
      navigate("/login")
    }
  }, [navigate, user, currentPath])

  return null
}

export default AppRouter
