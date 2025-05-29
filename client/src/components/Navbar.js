import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/petlogo2.png"; // <-- Adjust this path to your logo

function Navbar() {
  return (
    <nav className="navbar custom-navbar px-4">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logo}
            alt="Logo"
            className="d-inline-block align-text-top me-2"
          />
          <span>Pet Store</span>
        </Link>

        <div className="d-flex gap-3">
          <Link className="nav-link" to="/products">
            Products
          </Link>
          <Link className="nav-link" to="/orders">
            My Orders
          </Link>
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
// we don't need the homepage anymore really
export default Navbar;
