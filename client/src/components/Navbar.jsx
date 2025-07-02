import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import authService from "../api/auth";

function Navbar() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const isAuthenticated = !!user;

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          LinkVista
        </Link>
        <div className="navabr-links">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="navbar-link">
                Dashboard
              </Link>
              <button className="navbar-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-button login-btn">
                Login
              </Link>
              <Link to="/register" className="navbar-button">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
