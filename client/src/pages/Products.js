import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);

  const API_URL =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_API_BASE_DEV
      : process.env.REACT_APP_API_BASE;

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to load products:", err));
  }, [API_URL]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Our Products</h2>
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
