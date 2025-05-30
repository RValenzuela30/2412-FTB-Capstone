import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/petlogo2.png";
import { useAuth } from "../AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar custom-navbar navbar-expand-lg px-4">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo and Brand */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logo}
            alt="Logo"
            className="me-2"
            style={{ height: "40px", width: "auto" }}
          />
          <span>Pup 'N Suds</span>
        </Link>

        {/* Navigation and Auth */}
        <div className="d-flex align-items-center gap-3">
          <Link className="nav-link" to="/products">
            Products
          </Link>

          {user?.role === "customer" && (
            <Link className="nav-link" to="/orders">
              My Orders
            </Link>
          )}

          {user ? (
            <div className="d-flex align-items-center gap-3">
              <span className="nav-link m-0 p-0">Welcome, {user.name}</span>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link className="nav-link" to="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
