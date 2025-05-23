import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.js";
import Products from "./pages/Products.js";
import Orders from "./pages/Orders.js";
import Login from "./pages/Login.js";


function App() {
  return (
    <Router>
      <nav style={styles.nav}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/products" style={styles.link}>Products</Link>
        <Link to="/orders" style={styles.link}>My Orders</Link>
        <Link to="/login" style={styles.link}>Login/Signup</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

const styles = {
  nav: {
    display: "flex",
    gap: "1rem",
    padding: "1rem",
    backgroundColor: "#f0f0f0",
  },
  link: {
    textDecoration: "none",
    color: "black",
    fontWeight: "bold",
  }
};

export default App;
