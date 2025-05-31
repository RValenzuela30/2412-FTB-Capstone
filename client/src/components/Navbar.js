import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/petlogo2.png";
import { useAuth } from "../AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar custom-navbar px-4">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logo}
            alt="Logo"
            className="d-inline-block align-text-top me-2"
          />
          <span>Pet Store</span>
        </Link>

        <div className="d-flex align-items-center gap-4">
          <Link className="nav-link" to="/products">
            Products
          </Link>

          {user?.role === "customer" && (
            <Link className="nav-link" to="/orders">
              My Orders
            </Link>
          )}

          {user?.role === "admin" && (
            <Link className="nav-link" to="/admin">
              Admin Page
            </Link>
          )}

          {!user ? (
            <Link className="nav-link" to="/login">
              Login
            </Link>
          ) : (
            <>
              <span className="fw-semibold fs-5">
                Welcome, {user.name.split(" ")[0]}
              </span>
              <button className="btn btn-sm btn-outline-dark" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
