import Navbar from "../components/Navbar"
import Menu from "../components/Menu"

import "./layout.css"
import { Collapse } from "@mui/material"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const Layout = ({ children }) => {
  const [menuStatus, setMenuStatus] = useState(false)
  const { user } = useSelector((state) => state.auth)
  const [clientSide, setClientSide] = useState(false)
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener("popstate", handleLocationChange)
    window.addEventListener("pushState", handleLocationChange)
    window.addEventListener("replaceState", handleLocationChange)

    return () => {
      window.removeEventListener("popstate", handleLocationChange)
      window.removeEventListener("pushState", handleLocationChange)
      window.removeEventListener("replaceState", handleLocationChange)
    }
  }, [])

  const handleMenu = () => {
    setMenuStatus(!menuStatus)
  }
  
  // if the current path is /survey, set the client side to true, hide top bar things about login and register
  useEffect(() => {
    if (currentPath === "/survey" || currentPath === '/surveySuccess' || currentPath === '/voting') setClientSide(true)
    else setClientSide(false)
  }, [currentPath])

  return (
    <div>
      {!clientSide && <Navbar handleMenu={handleMenu} menuStatus={menuStatus} />}
      <div className="layout-wrapper">
        {user?.token && !clientSide && (
          <Collapse
            in={menuStatus}
            classes={{ root: "menu-fixed" }}
            orientation="horizontal"
          >
            <Menu />
          </Collapse>
        )}
        {children}
      </div>
    </div>
  )
}

export default Layout
