import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function AdminPage() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
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

  const handleUpdate = async (id, field, value) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, [field]: value } : p
    );
    setProducts(updated);

    try {
      await fetch(`http://localhost:3001/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updated.find((p) => p.id === id)),
      });
    } catch (err) {
      console.error("Error updating product:", err);
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

      const created = await res.json();
      setProducts([...products, created]);
      setNewProduct({ name: "", price: "", imageUrl: "" });
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(products.filter((p) => p.id !== id));
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
                src={product.imageUrl}
                alt={product.name}
                className="card-img-top"
                style={{ objectFit: "cover", height: "200px" }}
              />
              <div className="card-body">
                <input
                  className="form-control mb-2"
                  value={product.name}
                  onChange={(e) =>
                    handleUpdate(product.id, "name", e.target.value)
                  }
                  onBlur={() => handleUpdate(product.id, "name", product.name)}
                />
                <input
                  className="form-control mb-2"
                  type="number"
                  value={product.price}
                  onChange={(e) =>
                    handleUpdate(product.id, "price", e.target.value)
                  }
                  onBlur={() =>
                    handleUpdate(product.id, "price", product.price)
                  }
                />
                <input
                  className="form-control mb-3"
                  value={product.imageUrl}
                  onChange={(e) =>
                    handleUpdate(product.id, "imageUrl", e.target.value)
                  }
                  onBlur={() =>
                    handleUpdate(product.id, "imageUrl", product.imageUrl)
                  }
                />
                <button
                  className="btn btn-delete btn-sm"
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
