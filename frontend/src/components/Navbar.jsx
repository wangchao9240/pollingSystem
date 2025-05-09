import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

import "./Navbar.css"

const Navbar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  return (
    <nav className="bg-blue-500 text-white p-4 flex justify-between items-center">

      <div className="flex items-center space-x-4">
        <Link to="/" className={"text-2xl font-bold"}>
          Online Polling System
        </Link>
        {user && (
          <span className="ml-25 font-semibold italic text-lg mt-0.5">
            Hello, {user.name}
          </span>
        )}
      </div>
      <div>
        {user ? (
          <>
            <Link to="/surveyList" className="mr-4 hover:text-gray-300">
              Surveys
            </Link>
            <Link to="/profile" className="mr-4 hover:text-gray-300">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-orange-500 px-4 py-2 rounded hover:bg-orange-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4 hover:text-gray-300">
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
