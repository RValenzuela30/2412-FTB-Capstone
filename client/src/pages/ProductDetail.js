import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useCart } from "../CartContext";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`http://localhost:3001/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Error loading product:", err));
  }, [id]);

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
          <button
            className="btn btn-primary"
            onClick={() => {
              console.log("Adding to cart:", product);
              addToCart(product);
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
