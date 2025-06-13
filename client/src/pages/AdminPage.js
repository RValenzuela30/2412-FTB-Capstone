import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function AdminPage() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

  const [tab, setTab] = useState("products");

  const [products, setProducts] = useState([]);
  const [editedProducts, setEditedProducts] = useState({});
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    imageUrl: "",
  });

  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      fetchProducts();
    }
  }, [user, navigate]);

  useEffect(() => {
    if (tab === "users") {
      fetchUsers();
    }
  }, [tab]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleUpdate = (id, field, value) => {
    const updatedValue = field === "price" ? parseFloat(value) : value;

    setEditedProducts((prev) => ({
      ...prev,
      [id]: {
        ...products.find((p) => p.id === id),
        ...prev[id],
        [field]: updatedValue,
      },
    }));
  };

  const handleSave = async (id) => {
    if (!editedProducts[id]) return;

    const updatedProduct = { ...editedProducts[id] };

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProduct),
      });

      if (res.ok) {
        const updated = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
        setEditedProducts((prev) => {
          const { [id]: _, ...rest } = prev;
          return rest;
        });
      } else {
        console.error("Failed to save changes");
      }
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.imageUrl) return;

    try {
      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          imageUrl: newProduct.imageUrl,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setProducts([...products, created]);
        setNewProduct({ name: "", price: "", imageUrl: "" });
      } else {
        console.error("Failed to add product");
      }
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
        setEditedProducts((prev) => {
          const { [id]: _, ...rest } = prev;
          return rest;
        });
      } else {
        console.error("Failed to delete product");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      } else {
        console.error("Failed to update user role");
      }
    } catch (err) {
      console.error("Error updating user role:", err);
    }
  };

  const handleUserDelete = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      } else {
        console.error("Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleAddUser = async () => {
    const { name, email, password, role } = newUser;
    if (!name || !email || !password || !role) return;

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (res.ok) {
        const created = await res.json();
        setUsers([...users, created]);
        setNewUser({ name: "", email: "", password: "", role: "customer" });
      } else {
        console.error("Failed to add user");
      }
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      <div className="mb-4">
        <button
          className={`btn me-2 ${tab === "products" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setTab("products")}
        >
          Products
        </button>
        <button
          className={`btn ${tab === "users" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setTab("users")}
        >
          Users
        </button>
      </div>

    </div>
  );
}

export default AdminPage;
