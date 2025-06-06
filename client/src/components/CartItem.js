import React from "react";
import { useCart } from "../CartContext";

function CartItem({ item }) {
  const { decreaseQuantity } = useCart();

  return (
    <div className="card mb-2">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5>{item.name}</h5>
          <p>Quantity: {item.quantity}</p>
          <p>${(item.price * item.quantity).toFixed(2)}</p>
          <button
            className="btn btn-sm btn-danger mt-2"
            onClick={() => decreaseQuantity(item.id)}
          >
            Remove item
          </button>
        </div>
        <img
          src={item.imageUrl}
          alt={item.name}
          style={{ width: "80px", height: "80px", objectFit: "cover" }}
        />
      </div>
    </div>
  );
}

export default CartItem;
