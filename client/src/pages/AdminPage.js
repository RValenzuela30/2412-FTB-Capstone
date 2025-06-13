import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function AdminPage() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const API_URL =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_API_BASE_DEV
      : process.env.REACT_APP_API_BASE;

  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [editedProducts, setEditedProducts] = useState({});
  const [newProduct, setNewProduct] = useState({ name: "", price: "", imageUrl: "" });

  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "customer" });

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/");
    else fetchProducts();
  }, [user, navigate]);

  useEffect(() => {
    if (tab === "users") fetchUsers();
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
        headers: { Authorization: `Bearer ${token}` },
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
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedProducts[id]),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
        const { [id]: _, ...rest } = editedProducts;
        setEditedProducts(rest);
      }
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleAddProduct = async () => {
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
      }
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, role } : u)));
      }
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  const handleUserDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleAddUser = async () => {
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });
      if (res.ok) {
        const created = await res.json();
        setUsers([...users, created]);
        setNewUser({ name: "", email: "", password: "", role: "customer" });
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
          <div className="row">
            {products.map((product) => (
              <div key={product.id} className="col-md-4 mb-4">
                <div className="card h-100">
                  <img src={product.imageUrl} className="card-img-top" alt={product.name} />
                  <div className="card-body">
                    <input
                      className="form-control mb-2"
                      value={editedProducts[product.id]?.name || product.name}
                      onChange={(e) => handleUpdate(product.id, "name", e.target.value)}
                    />
                    <input
                      className="form-control mb-2"
                      value={editedProducts[product.id]?.price || product.price}
                      onChange={(e) => handleUpdate(product.id, "price", e.target.value)}
                      type="number"
                      step="0.01"
                    />
                    <input
                      className="form-control mb-2"
                      value={editedProducts[product.id]?.imageUrl || product.imageUrl}
                      onChange={(e) => handleUpdate(product.id, "imageUrl", e.target.value)}
                    />
                    <button className="btn btn-success me-2" onClick={() => handleSave(product.id)}>
                      Save
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(product.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card mt-4 p-3">
            <h5>Add New Product</h5>
            <input
              className="form-control mb-2"
              placeholder="Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <input
              className="form-control mb-2"
              placeholder="Price"
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <input
              className="form-control mb-2"
              placeholder="Image URL"
              value={newProduct.imageUrl}
              onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
            />
            <button className="btn btn-primary" onClick={handleAddProduct}>
              Add Product
            </button>
          </div>
        </>
      )}

      {tab === "users" && (
        <>
          <div className="row">
            {users.map((u) => (
              <div key={u.id} className="col-md-4 mb-4">
                <div className="card h-100 p-3">
                  <h5>{u.name}</h5>
                  <p>Email: {u.email}</p>
                  <select
                    className="form-select mb-2"
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button className="btn btn-danger" onClick={() => handleUserDelete(u.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="card mt-4 p-3">
            <h5>Add New User</h5>
            <input
              className="form-control mb-2"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              className="form-control mb-2"
              placeholder="Email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <input
              className="form-control mb-2"
              placeholder="Password"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <select
              className="form-select mb-3"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
            <button className="btn btn-primary" onClick={handleAddUser}>
              Add User
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminPage;
