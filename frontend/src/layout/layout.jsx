import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom" // Add useLocation
import Navbar from "../components/Navbar"
import "./layout.css"

const Layout = ({ children }) => {
  const location = useLocation() // Use React Router's useLocation hook
  const [clientSide, setClientSide] = useState(false)

  // Effect to run whenever the route changes
  useEffect(() => {
    console.log("location changed!!!", location.pathname)
    
    // Check if the path is a client-side only route
    if (
      location.pathname === "/login" ||
      location.pathname === "/register" ||
      location.pathname === "/survey" ||
      location.pathname === "/surveySuccess" ||
      location.pathname === "/voting"
    ) {
      setClientSide(true)
    } else {
      setClientSide(false)
    }
  }, [location.pathname]) // Only re-run when pathname changes

  return (
    <div>
      {!clientSide && <Navbar />}
      <div style={{ padding: "20px" }}>{children}</div>
    </div>
  )
}

export default Layout
