import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

import { Menu as MenuIcon, MenuOpen as MenuOpenIcon } from "@mui/icons-material"

import "./Navbar.css"

const Navbar = (props) => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  return (
    <nav style={{ position: 'relative' }} className="bg-blue-600 text-white p-4 flex justify-between items-center">
      { user?.token && (
        <div className="menu-icon-wrapper">
          {props.menuStatus ? <MenuOpenIcon onClick={props.handleMenu} /> : <MenuIcon onClick={props.handleMenu} />}
        </div>
      ) }
      <Link to="/" className={"text-2xl font-bold ml-" + (user?.token ? "10" : "0")}>
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
