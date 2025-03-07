import Navbar from "../components/Navbar"
import Menu from "../components/Menu"

import "./layout.css"
import { Collapse } from "@mui/material"
import { useState } from "react"
import { useSelector } from "react-redux"

const Layout = ({ children }) => {
  const [menuStatus, setMenuStatus] = useState(false)
  const { user } = useSelector((state) => state.auth)

  const handleMenu = () => {
    setMenuStatus(!menuStatus)
  }

  return (
    <div>
      <Navbar handleMenu={handleMenu} menuStatus={menuStatus} />
      <div className="layout-wrapper">
        {user?.token && (
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
