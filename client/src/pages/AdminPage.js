import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function AdminPage() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

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
      const res = await fetch("http://localhost:3001/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/users", {
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
      const res = await fetch(`http://localhost:3001/api/products/${id}`, {
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
      const res = await fetch("http://localhost:3001/api/products", {
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
      const res = await fetch(`http://localhost:3001/api/products/${id}`, {
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
      const res = await fetch(`http://localhost:3001/api/users/${userId}`, {
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
      const res = await fetch(`http://localhost:3001/api/users/${userId}`, {
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
      const res = await fetch("http://localhost:3001/api/users", {
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

      {tab === "products" && (
        <>
          <div className="card mb-4">
            <div className="card-header">Add New Product</div>
            <div className="card-body row g-3">
              <div className="col-md-4">
                <input
                  className="form-control"
                  placeholder="Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <input
                  className="form-control"
                  placeholder="Image URL"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                />
              </div>
              <div className="col-md-1">
                <button className="btn btn-success w-100" onClick={handleAddProduct}>
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {products.map((p) => (
              <div key={p.id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm">
                  <img src={p.imageUrl} className="card-img-top" alt={p.name} />
                  <div className="card-body">
                    <input
                      className="form-control mb-2"
                      value={editedProducts[p.id]?.name ?? p.name}
                      onChange={(e) => handleUpdate(p.id, "name", e.target.value)}
                    />
                    <input
                      className="form-control mb-2"
                      type="number"
                      value={editedProducts[p.id]?.price ?? p.price}
                      onChange={(e) => handleUpdate(p.id, "price", e.target.value)}
                    />
                    <input
                      className="form-control mb-2"
                      value={editedProducts[p.id]?.imageUrl ?? p.imageUrl}
                      onChange={(e) => handleUpdate(p.id, "imageUrl", e.target.value)}
                    />
                    <div className="d-flex justify-content-between">
                      <button className="btn btn-primary" onClick={() => handleSave(p.id)}>Save</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "users" && (
        <>
          <div className="card mb-4">
            <div className="card-header">Add New User</div>
            <div className="card-body row g-3">
              <div className="col-md-3">
                <input
                  className="form-control"
                  placeholder="Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <input
                  className="form-control"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="customer">customer</option>
                  <option value="admin">admin</option>
                </select>
              </div>
              <div className="col-md-1">
                <button className="btn btn-success w-100" onClick={handleAddUser}>
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {users.map((u) => (
              <div key={u.id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5>{u.name}</h5>
                    <p>Email: {u.email}</p>
                    <p>
                      Role:{" "}
                      <select
                        className="form-select"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      >
                        <option value="customer">customer</option>
                        <option value="admin">admin</option>
                      </select>
                    </p>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleUserDelete(u.id)}
                    >
                      Delete User
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminPage;
