import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Menu as MenuIcon, MenuOpen as MenuOpenIcon } from "@mui/icons-material"

import "./Navbar.css"

const Navbar = (props) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav style={{ position: 'relative' }} className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="menu-icon-wrapper">
        {props.menuStatus ? <MenuOpenIcon onClick={props.handleMenu} /> : <MenuIcon onClick={props.handleMenu} />}
      </div>
      <Link to="/" className="text-2xl font-bold ml-10">
        Online Polling System
      </Link>
      <div>
        {user ? (
          <>
            <Link to="/tasks" className="mr-4">
              CRUD
            </Link>
            <Link to="/profile" className="mr-4">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
