import Navbar from "../components/Navbar"

import "./layout.css"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.auth)
  const [clientSide, setClientSide] = useState(false)
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname)
    }

    // Listen for browser back/forward navigation
    window.addEventListener("popstate", handleLocationChange)
    
    return () => {
      window.removeEventListener("popstate", handleLocationChange)
          }
  }, [])

  useEffect(() => {
    // Check if the path is exactly "/survey" OR exactly "/surveySuccess"
    if (currentPath === "/survey" || currentPath === '/surveySuccess' || currentPath === '/voting') { 
      setClientSide(true)
    } else {
      setClientSide(false)
    }
  }, [currentPath])

  return (
    <div>
      {!clientSide && <Navbar />}
      <div style={{ padding: '20px' }}>
        {children}
      </div>
    </div>
  )
}

export default Layout
