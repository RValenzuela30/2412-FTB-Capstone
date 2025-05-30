import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/petlogo2.png";
import { useAuth } from "../AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <div className="container-fluid">
        {/* Logo and Brand */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logo}
            alt="Logo"
            style={{ height: "40px", marginRight: "10px" }}
          />
          <span>Pup 'N Suds</span>
        </Link>

        {/* Nav links and auth info */}
        <div className="d-flex align-items-center ms-auto gap-3">
          <Link className="nav-link" to="/products">
            Products
          </Link>

          {user?.role === "customer" && (
            <Link className="nav-link" to="/orders">
              My Orders
            </Link>
          )}

          {user ? (
            <>
              <span className="navbar-text">Welcome, {user.name}</span>
              <button className="btn btn-outline-secondary" onClick={logout}>
                Logout
              </button>
            </>
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
