import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function AdminPage() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [editedProducts, setEditedProducts] = useState({});
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      fetchProducts();
    }
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // ✅ Updated: parseFloat if editing "price"
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
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? updated : p))
        );
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

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      <div className="card mb-4">
        <div className="card-header">Add New Product</div>
        <div className="card-body row g-3">
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Price"
              type="number"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
          </div>
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Image URL"
              value={newProduct.imageUrl}
              onChange={(e) =>
                setNewProduct({ ...newProduct, imageUrl: e.target.value })
              }
            />
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-success w-100"
              onClick={handleAddProduct}
            >
              Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {products.map((product) => (
          <div key={product.id} className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm">
              <img
                src={editedProducts[product.id]?.imageUrl || product.imageUrl}
                alt={product.name}
                className="card-img-top"
                style={{ objectFit: "cover", height: "200px" }}
              />
              <div className="card-body">
                <input
                  className="form-control mb-2"
                  value={editedProducts[product.id]?.name ?? product.name}
                  onChange={(e) =>
                    handleUpdate(product.id, "name", e.target.value)
                  }
                />
                <input
                  className="form-control mb-2"
                  type="number"
                  value={editedProducts[product.id]?.price ?? product.price}
                  onChange={(e) =>
                    handleUpdate(product.id, "price", e.target.value)
                  }
                />
                <input
                  className="form-control mb-3"
                  value={editedProducts[product.id]?.imageUrl ?? product.imageUrl}
                  onChange={(e) =>
                    handleUpdate(product.id, "imageUrl", e.target.value)
                  }
                />
                {editedProducts[product.id] && (
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleSave(product.id)}
                  >
                    Save
                  </button>
                )}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPage;
