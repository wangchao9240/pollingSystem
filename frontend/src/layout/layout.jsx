import Navbar from "../components/Navbar"
import Menu from "../components/Menu"

import "./layout.css"
import { Collapse } from "@mui/material"
import { useState } from "react"

const Layout = ({ children }) => {
  const [menuStatus, setMenuStatus] = useState(false)

  const handleMenu = () => {
    setMenuStatus(!menuStatus)
  }

  return (
    <div>
      <Navbar handleMenu={handleMenu} menuStatus={menuStatus} />
      <div className="layout-wrapper">
        <Collapse
          in={menuStatus}
          classes={{ root: "menu-fixed" }}
          orientation="horizontal"
        >
          <Menu />
        </Collapse>
        {children}
      </div>
    </div>
  )
}

export default Layout
