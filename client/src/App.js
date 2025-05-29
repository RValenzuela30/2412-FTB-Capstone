import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home.js";
import Products from "./pages/Products.js";
import Orders from "./pages/Orders.js";
import Login from "./pages/Login.js";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar /> {/* Use new component */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
