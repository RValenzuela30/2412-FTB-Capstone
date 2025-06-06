import React from "react";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="text-decoration-none text-dark"
    >
      <div className="card h-100 shadow-sm">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            className="card-img-top"
            alt={product.name}
            style={{ objectFit: "cover", height: "200px" }}
          />
        )}
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text">${product.price.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
