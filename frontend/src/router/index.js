import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import Login from "../pages/Login"
import Register from "../pages/Register"
import Profile from "../pages/Profile"
import SurverList from "../pages/SurveyList"
import Layout from "../layout/layout"

const AppRouter = () => {
  return (
    <Router>
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

export default AppRouter
