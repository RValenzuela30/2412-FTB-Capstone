import React from "react";

function ProductCard({ product }) {
  return (
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
  );
}

export default ProductCard;
