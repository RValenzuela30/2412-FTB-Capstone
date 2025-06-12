import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useCart } from "../CartContext";

function Checkout() {
  const { user, token } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mailingAddress: "",
    billingInfo: "",
    cardNumber: "",
    cvv: "",
    expiration: "",
    copyAddress: false,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        mailingAddress: user.mailingAddress || "",
        billingInfo: user.billingInfo || "",
      }));
    }
  }, [user, navigate]);

  useEffect(() => {
    if (formData.copyAddress) {
      setFormData((prev) => ({
        ...prev,
        billingInfo: prev.mailingAddress,
      }));
    }
  }, [formData.copyAddress]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "cardNumber") {
      const numeric = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: numeric });
    } else if (name === "cvv") {
      const limited = value.replace(/\D/g, "").slice(0, 3);
      setFormData({ ...formData, [name]: limited });
    } else if (name === "expiration") {
      let formatted = value.replace(/[^\d]/g, "");
      if (formatted.length >= 3) {
        formatted = formatted.slice(0, 2) + "/" + formatted.slice(2, 4);
      }
      setFormData({ ...formData, [name]: formatted.slice(0, 5) });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart,
          total: parseFloat(total),
          shippingInfo: formData.mailingAddress,
          billingInfo: formData.billingInfo,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to place order");
        return;
      }

      clearCart();
      alert("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Server error while placing order");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit} className="row g-3 mt-3">
        <div className="col-md-6">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Mailing Address</label>
          <input
            className="form-control"
            name="mailingAddress"
            value={formData.mailingAddress}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-12">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="copyAddress"
              checked={formData.copyAddress}
              onChange={handleChange}
            />
            <label className="form-check-label">
              Use Mailing Address as Billing Info
            </label>
          </div>
        </div>

        <div className="col-md-6">
          <label className="form-label">Billing Address</label>
          <textarea
            className="form-control"
            name="billingInfo"
            rows="1"
            value={formData.billingInfo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="w-100"></div>

        <div className="col-md-6">
          <label className="form-label">Card Number</label>
          <input
            className="form-control"
            name="cardNumber"
            placeholder="Card Number"
            value={formData.cardNumber}
            onChange={handleChange}
            maxLength="16"
            required
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">CVV</label>
          <input
            className="form-control"
            name="cvv"
            placeholder="CVV"
            value={formData.cvv}
            onChange={handleChange}
            maxLength="3"
            required
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Expiration (MM/YY)</label>
          <input
            className="form-control"
            name="expiration"
            placeholder="MM/YY"
            value={formData.expiration}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-12">
          <h5 className="mt-4">Cart Summary</h5>
          <ul className="list-group mb-3">
            {cart.map((item) => (
              <li key={item.id} className="list-group-item d-flex justify-content-between">
                <span>{item.name}</span>
                <span>${item.price.toFixed(2)}</span>
              </li>
            ))}
            <li className="list-group-item d-flex justify-content-between fw-bold">
              <span>Total</span>
              <span>${total}</span>
            </li>
          </ul>
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-success w-100">
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
