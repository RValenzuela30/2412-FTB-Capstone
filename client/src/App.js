import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import AdminPage from "./pages/AdminPage";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { useAuth } from "./AuthContext";
import { CartProvider } from "./CartContext";

function AppContent() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Router>
      <div className="layout-wrapper">
        <Navbar user={user} onLogout={handleLogout} />

        <div className="container mt-4 main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route
              path="/orders"
              element={
                user && user.role === "customer" ? (
                  <Orders />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/admin"
              element={
                user && user.role === "admin" ? (
                  <AdminPage />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/profile"
              element={
                user && user.role === "customer" ? (
                  <Profile />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/checkout"
              element={
                user && user.role === "customer" ? (
                  <Checkout />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
