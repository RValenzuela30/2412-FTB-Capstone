import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import ProductDetail from "./pages/ProductDetail";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
