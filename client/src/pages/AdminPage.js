// src/pages/AdminPage.js
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function AdminPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/"); 
    }
  }, [user, navigate]);

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      <p>Welcome, {user?.name}! You have admin access.</p>
      {/* Text*/}
    </div>
  );
}

export default AdminPage;
