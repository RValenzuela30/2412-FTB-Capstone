import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useCart } from "../CartContext";
import { useAuth } from "../AuthContext";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const [addedMessage, setAddedMessage] = useState("");
  const { user } = useAuth();

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

  useEffect(() => {
    fetch(`${API_URL}/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Error loading product:", err));
  }, [id, API_URL]);

  if (!product) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="row align-items-center">
        <div className="col-md-6">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p className="lead">${product.price.toFixed(2)}</p>
          {user && user.role === "customer" && (
            <>
              <button
                className="btn btn-primary"
                onClick={() => {
                  console.log("Adding to cart:", product);
                  addToCart(product);
                  setAddedMessage("Item added to cart!");
                  setTimeout(() => setAddedMessage(""), 2000);
                }}
              >
                Add to Cart
              </button>
              {addedMessage && (
                <div className="alert alert-success mt-3">{addedMessage}</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
